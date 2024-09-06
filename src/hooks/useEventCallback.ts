import { useRef, useCallback } from "react";

const useEventCallback = <I extends unknown[], O>(cb: (...args: I) => O) => {
  const cbRef = useRef<(...args: I) => O>(cb);
  cbRef.current = cb;

  return useCallback((...args: I) => {
    return cbRef.current(...args);
  }, []);
};

export default useEventCallback;
