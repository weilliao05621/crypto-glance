import { AaveV3Sepolia, AaveV3Ethereum } from "@bgd-labs/aave-address-book";
import { type Address } from "viem";

// constants
import { CHAIN_ID, type ValidChainId } from "~/constants/chains/chainId";

type TOKEN_PRICES_MAP = {
  [C in ValidChainId]: Address;
};

export const AAVE_TOKENS_PRICES: TOKEN_PRICES_MAP = {
  [CHAIN_ID.ETHEREUM]: AaveV3Ethereum.ORACLE as Address,
  [CHAIN_ID.SEPOLIA]: AaveV3Sepolia.ORACLE as Address,
} as const;
