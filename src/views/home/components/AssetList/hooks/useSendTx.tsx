import { useSendTransaction, useWriteContract } from "wagmi";
import { isAddress, parseEther, type Address } from "viem";

import { type ValidToken } from "~/constants/tokens";
import { IERC20_ABI } from "@bgd-labs/aave-address-book";
import useEventCallback from "~/hooks/useEventCallback";
import { PendingTx } from "../types";

interface SendTxProps {
  token?: ValidToken;
  address?: Address;
  handler: (
    cb: () => Promise<PendingTx | null>,
    submitData: { to: UnValidatedAddress; amount: string; token?: ValidToken },
  ) => void;
}

type SendTxReturnFn = (
  to: UnValidatedAddress,
  amount: string,
) => Promise<string | void>;

type UnValidatedAddress = string;

const useSendTx = (props: SendTxProps): SendTxReturnFn => {
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const makeTransfer = async (
    to: Address,
    amount: string,
    address?: Address,
  ) => {
    const isNative = !address;
    const value = parseEther(amount);

    switch (isNative) {
      case true: {
        return await sendTransactionAsync({
          to,
          value,
        });
      }

      case false: {
        return await writeContractAsync({
          abi: IERC20_ABI,
          address: address!,
          functionName: "transfer",
          args: [to, value],
        });
      }

      default:
        return null;
    }
  };

  const transferToken = async (to: UnValidatedAddress, amount: string) => {
    if (!isAddress(to)) return "Invalid address";
    const errorMsg = validateTransferAmount(amount);
    if (errorMsg) return errorMsg;

    props.handler(
      async () => {
        if (!props.token) return null;

        const hash = await makeTransfer(to, amount, props.address);
        if (!hash) return null;
        const pendingTx = {
          hash,
          amount,
          token: props.token,
          to,
        };

        return pendingTx;
      },
      { to, amount, token: props.token },
    );
  };

  return useEventCallback(transferToken);
};

export default useSendTx;

function validateTransferAmount(amount: string): void | string {
  if (!amount) {
    return "Amount should be filled";
  }

  const isGreaterThanZero = parseFloat(amount) > 0;

  if (!isGreaterThanZero) {
    return "Amount should be greater than 0";
  }
}
