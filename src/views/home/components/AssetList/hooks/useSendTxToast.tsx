import { useCallback, useMemo, useRef } from "react";

import { useToast, type UseToastOptions } from "@chakra-ui/react";

type ToastInfo = {
  title: string;
  description: string;
  duration?: number;
  isClosable?: boolean;
};

type ToastObj = {
  init: (args: ToastInfo) => void;
  set: (status: "loading" | "success" | "error", args: ToastInfo) => void;
};

const useSendTxToast = () => {
  const toast = useToast();
  const toastRef = useRef<ReturnType<typeof toast> | null>(null);

  const callToastMethod = useCallback(
    (toastContent: UseToastOptions) => {
      if (!toastRef.current) {
        toastRef.current = toast(toastContent);
        return;
      }
      toast.update(toastRef.current, toastContent);
    },
    [toast],
  );

  const toastObj = useMemo<ToastObj>(
    () => ({
      init: (info) => {
        toastRef.current = toast({
          position: "top-right",
          duration: info.duration ?? 20_000,
          isClosable: info.isClosable ?? true,
          status: "loading",
          title: info.title,
          description: info.description,
          onCloseComplete: () => {
            toastRef.current = null;
          },
        });
      },
      set: (status, info) => {
        const toastContent = {
          position: "top-right" as const,
          duration: info.duration ?? 20_000,
          isClosable: info.isClosable ?? true,
          status,
          title: info.title,
          description: info.description,
          onCloseComplete: () => {
            toastRef.current = null;
          },
        };

        callToastMethod(toastContent);
      },
    }),
    [toast, callToastMethod],
  );

  return toastObj;
};

export default useSendTxToast;
