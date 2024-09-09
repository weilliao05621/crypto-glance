import { useSendTransaction, useWriteContract } from "wagmi";
import { isAddress, type Address } from "viem";

import { IERC20_ABI } from "@bgd-labs/aave-address-book";

// hooks
import useEventCallback from "~/hooks/useEventCallback";

// types
import { type ValidToken } from "~/constants/tokens";
import type { PendingTx } from "../types";

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
  decimals: number,
) => Promise<string | void>;

type UnValidatedAddress = string;

const useSendTx = (props: SendTxProps): SendTxReturnFn => {
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const makeTransfer = async (props: {
    to: Address;
    amount: string;
    address?: Address;
    decimals: number;
  }) => {
    const address = props.address;
    const isNative = !address;
    const value = BigInt(`${+props.amount * Math.pow(10, props.decimals)}`);
    const to = props.to;

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

  const transferToken = async (
    to: UnValidatedAddress,
    amount: string,
    decimals: number,
  ) => {
    if (!isAddress(to)) return "Invalid address";
    const errorMsg = validateTransferAmount(amount);
    if (errorMsg) return errorMsg;

    props.handler(
      async () => {
        if (!props.token) return null;

        const hash = await makeTransfer({
          to,
          amount,
          address: props.address,
          decimals,
        });
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
