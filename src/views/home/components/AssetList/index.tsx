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
import MemoTxSuccessWatcher from "./components/TxSuccessWatcher";

// utils
import { devErrorLog } from "~/utils/logger";

// constants
import { TOKEN_MAP } from "~/constants/tokens";

// types
import type { PendingTx, SelectedToken, SuccessTxReceipt } from "./types";

type SelectedTokenState = SelectedToken | null;
type PendingTxState = PendingTx;

const AssetList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const account = useAccount();
  const chainId = useChainId();

  const [selectedToken, setSelectedToken] = useState<SelectedTokenState>(null);
  const [pendingTxs, setPendingTxs] = useState<Array<PendingTxState>>([]);

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

        setPendingTxs((prev) => [
          ...prev,
          { ...newPendingTx, tokenAddress: selectedToken?.address },
        ]);

        toast.set("success", {
          title: "Sent transaction",
          description:
            "Await for tx be included in the new block" +
            ` (TxHash: ${newPendingTx.hash})`,
        });

        onClose();
      } catch (e) {
        devErrorLog(e);
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
      const hash = txReceipt.hash;
      const token = txReceipt.token;
      const amount = txReceipt.amount;
      const to = txReceipt.to ? ` ${txReceipt.to}` : "";

      (async () => {
        toast.set("success", {
          title: `Complete transaction!`,
          description: `Check the tx hash at ${hash}. (Sent ${amount} ${token}${to})`,
          duration: 7_000,
        });
        await queryAssetBalance(token);
        setPendingTxs((prev) => prev.filter((tx) => tx?.hash !== hash));
      })();
    },
  );

  return (
    <>
      <MemoAssetTable tokenList={tokens} onSelectedToken={onSelectedToken} />
      {pendingTxs.map((tx) => {
        return (
          <MemoTxSuccessWatcher
            key={tx.hash}
            assetAddress={tx.tokenAddress}
            pendingTx={tx}
            onReceiptReceived={onReceivedTxReceipt}
          />
        );
      })}
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
