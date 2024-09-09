import { memo, useEffect, useRef, useState } from "react";

import { useTransactionReceipt } from "wagmi";
import { type Address } from "viem";

// hooks
import useEventCallback from "~/hooks/useEventCallback";

// types
import type { PendingTx, SuccessTxReceipt } from "../types";

interface TxSuccessWatcherProps {
  pendingTx: PendingTx | null;
  assetAddress?: Address;
  onReceiptReceived: (tx: SuccessTxReceipt) => void;
}

const POLL_TX_RECEIPT_INTERVAL = 3_000;
const RETRY_TIMES = 10;

const TxSuccessWatcher = (props: TxSuccessWatcherProps) => {
  const { data, refetch: _refetch } = useTransactionReceipt({
    hash: props.pendingTx?.hash,
  });

  const selfControlPollingInterval = useRef<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const refetch = useEventCallback(_refetch);

  const onReceiptReceived = props.onReceiptReceived;

  useEffect(() => {
    if (!props.pendingTx) return;
    if (data?.status === "success") {
      onReceiptReceived({
        hash: props.pendingTx.hash,
        amount: props.pendingTx.amount,
        token: props.pendingTx.token,
        to: props.pendingTx.to,
        type: ` (${data?.type.toUpperCase()})`,
      });
      setRetryCount(0);
      return;
    }

    if (retryCount < RETRY_TIMES) {
      selfControlPollingInterval.current = setTimeout(() => {
        refetch();
        console.log("refetching tx receipt for:", props.pendingTx?.hash);
        setRetryCount((prev) => prev + 1);
      }, POLL_TX_RECEIPT_INTERVAL);
      return;
    }

    onReceiptReceived({
      hash: props.pendingTx.hash,
      amount: props.pendingTx.amount,
      token: props.pendingTx.token,
      to: props.pendingTx.to,
    });
    setRetryCount(0);

    return () => {
      clearTimeout(selfControlPollingInterval.current!);
    };
  }, [
    data?.status,
    retryCount,
    props.pendingTx,
    onReceiptReceived,
    data?.type,
    refetch,
  ]);

  return null;
};

const MemoTxSuccessWatcher = memo(TxSuccessWatcher);

export default MemoTxSuccessWatcher;
