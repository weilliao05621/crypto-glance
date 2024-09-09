import { useCallback, useMemo, useRef } from "react";

import { useToast, type UseToastOptions } from "@chakra-ui/react";

// utils
import { logging } from "~/utils/logger";

type ToastInfo = {
  title: string;
  description: string;
  duration?: number;
  isClosable?: boolean;
};

type ToastObj = {
  init: (args: ToastInfo) => void;
  set: (status: UseToastOptions["status"], args: ToastInfo) => void;
};

const useSendTxToast = () => {
  const toast = useToast();
  type ToastId = ReturnType<typeof toast>;
  const toastRef = useRef<Map<ToastId, true>>(new Map());

  const callToastMethod = useCallback(
    (toastContent: UseToastOptions, id: ReturnType<typeof toast>) => {
      const hasToast = !!toastRef.current.get(id);

      logging("will set id: ", hasToast, id);

      if (hasToast) {
        toast.update(id, toastContent);
        return;
      }

      toast.close(id);
      const newId = toast(toastContent);
      toastRef.current.set(newId, true);
    },
    [toast],
  );

  const toastObj = useMemo<ToastObj>(() => {
    let id: ToastId | null = null;

    return {
      init: (info) => {
        id = toast({
          position: "top-right",
        });

        logging("toast id(init):", id);

        toast.update(id, {
          duration: info.duration ?? 20_000,
          isClosable: info.isClosable ?? true,
          status: "loading",
          title: info.title,
          description: info.description,
          onCloseComplete: () => {
            toastRef.current.delete(id!);
          },
        });
        toastRef.current?.set(id, true);
      },
      set: (status, info) => {
        logging("toast id(set):", id);

        const content = {
          status,
          position: "top-right" as const,
          duration: info.duration ?? 20_000,
          isClosable: info.isClosable ?? true,
          title: info.title,
          description: info.description,
          onCloseComplete: () => {
            toastRef.current.delete(id!);
          },
        };

        callToastMethod(content, id!);
      },
    };
  }, [toast, callToastMethod]);

  return toastObj;
};

export default useSendTxToast;
