import { AaveV3Sepolia, AaveV3Ethereum } from "@bgd-labs/aave-address-book";

// constants
import { ChainId, type ValidChainId } from "~/constants/chains/chainId";

// types
import type { Address } from "~/types";

type TOKEN_PRICES_MAP = {
  [C in ValidChainId]: Address;
};

export const AAVE_TOKENS_PRICES: TOKEN_PRICES_MAP = {
  [ChainId.ETHEREUM]: AaveV3Ethereum.ORACLE as Address,
  [ChainId.SEPOLIA]: AaveV3Sepolia.ORACLE as Address,
} as const;
