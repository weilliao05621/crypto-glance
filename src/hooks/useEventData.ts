import { useRef, useMemo } from "react";

const useEventData = <O extends object>(object: O) => {
  const cbRef = useRef<O>(object);
  cbRef.current = { ...object };

  return useMemo(() => {
    return cbRef.current;
  }, []);
};

export default useEventData;
