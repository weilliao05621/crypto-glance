import { memo, useEffect, useRef, useState } from "react";

import { useTransactionReceipt } from "wagmi";
import { type Address } from "viem";

// hooks
import useEventCallback from "~/hooks/useEventCallback";

// utils
import { devLog } from "~/utils/logger";

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
  const hasEmitted = useRef<boolean>(false);

  const refetch = useEventCallback(_refetch);

  const onReceiptReceived = props.onReceiptReceived;

  useEffect(() => {
    if (hasEmitted.current) return;
    if (!props.pendingTx) return;

    const shouldRetry = retryCount < RETRY_TIMES;
    const shouldEmitReceived = data?.status === "success" || !shouldRetry;

    if (shouldEmitReceived) {
      const type = data?.type ? ` (${data.type.toUpperCase()})` : "";
      onReceiptReceived({
        hash: props.pendingTx.hash,
        amount: props.pendingTx.amount,
        token: props.pendingTx.token,
        to: props.pendingTx.to,
        type,
      });
      setRetryCount(0);
      hasEmitted.current = true;
      return;
    }

    selfControlPollingInterval.current = setTimeout(async () => {
      await refetch();
      devLog("refetching tx receipt for:", props.pendingTx?.hash);
      setRetryCount((prev) => prev + 1);
    }, POLL_TX_RECEIPT_INTERVAL);

    return () => {
      clearTimeout(selfControlPollingInterval.current!);
    };
  }, [
    data?.status,
    data?.type,
    retryCount,
    props.pendingTx,
    onReceiptReceived,
    refetch,
  ]);

  return null;
};

const MemoTxSuccessWatcher = memo(TxSuccessWatcher);

export default MemoTxSuccessWatcher;
