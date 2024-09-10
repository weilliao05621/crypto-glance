import type { ChainId } from "~/types";

export const CHAIN_ID = {
  ETHEREUM: 1 as ChainId,
  SEPOLIA: 11155111 as ChainId,
} as const;

export type ValidChainId = (typeof CHAIN_ID)[keyof typeof CHAIN_ID];
