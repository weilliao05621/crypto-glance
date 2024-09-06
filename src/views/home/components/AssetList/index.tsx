import { useState } from "react";

import { useAccount } from "wagmi";

import { useDisclosure } from "@chakra-ui/react";

// queries
import { useGetAssetBalanceQuery } from "~/hooks/query/assets";

// hooks
import useChainId from "~/hooks/wagmi/useChainId";
import useEventCallback from "~/hooks/useEventCallback";
import useSendTx from "./hooks/useSendTx";
import useSendTxToast from "./hooks/useSendTxToast";

// components
import MemoAssetTable from "./components/AssetTable";
import MemoTxModal from "./components/TxModal";
import TxSuccessWatcher from "./components/TxSuccessWatcher";

// constants
import { TOKEN_MAP } from "~/constants/tokens";

// types
import type { PendingTx, SelectedToken, SuccessTxReceipt } from "./types";

type SelectedTokenState = SelectedToken | null;
type PendingTxState = PendingTx | null;

const AssetList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const account = useAccount();
  const chainId = useChainId();

  const [selectedToken, setSelectedToken] = useState<SelectedTokenState>(null);
  const [pendingTx, setPendingTx] = useState<PendingTxState>(null);

  const toast = useSendTxToast();

  const queryAssetBalance = useGetAssetBalanceQuery({
    address: account.address,
    chainId,
    token: selectedToken?.token,
  });

  const tokens = TOKEN_MAP[chainId];

  const onSelectedToken = useEventCallback((args: SelectedToken) => {
    onOpen();
    setSelectedToken({
      token: args.token,
      decimals: args.decimals,
      address: args.address,
    });
  });

  const sendTxHandler = useSendTx({
    token: selectedToken?.token,
    address: selectedToken?.address,
    handler: async (cb, submitData) => {
      toast.init({
        title: "Sending transaction",
        description: `Transfer ${submitData.amount} ${submitData.token} to ${submitData.to}`,
      });
      try {
        const newPendingTx = await cb();
        if (!newPendingTx) return;
        setPendingTx(newPendingTx);
        toast.set("loading", {
          title: "Sent transaction",
          description: "Await for tx be included in the new block",
        });
      } catch (e) {
        console.log(e);
        toast.set("error", {
          title: "Transaction failed",
          description:
            "You may revert the tx, or please check your balance and network",
          duration: 5_000,
        });
      }
    },
  });

  const onReceivedTxReceipt = useEventCallback(
    (txReceipt: SuccessTxReceipt) => {
      const type = txReceipt.type ? ` (${txReceipt?.type.toUpperCase()})` : "";
      const hash = txReceipt.hash;
      const to = txReceipt.to;
      const amount = txReceipt.amount;
      const token = txReceipt.token;

      (async () => {
        toast.set("success", {
          title: `Complete transaction!${type}`,
          description: `Check the tx hash at ${hash}. Sent ${amount} ${token} to${to}$`,
          duration: 7_000,
        });
        await queryAssetBalance(token);
        onClose();
        setPendingTx(null);
      })();
    },
  );

  return (
    <>
      <MemoAssetTable tokenList={tokens} onSelectedToken={onSelectedToken} />
      <TxSuccessWatcher
        assetAddress={selectedToken?.address}
        pendingTx={pendingTx}
        onReceiptReceived={onReceivedTxReceipt}
      />
      {selectedToken && (
        <MemoTxModal
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          selectedToken={selectedToken}
          sendTxHandler={sendTxHandler}
        />
      )}
    </>
  );
};

export default AssetList;
