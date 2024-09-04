import { useChainId as useWagmiChainId } from "wagmi";

// types
import type { ChainId as ChainIdType } from "~/types";

const useChainId = () => {
  const chainId = useWagmiChainId();
  return chainId as ChainIdType;
};

export default useChainId;
