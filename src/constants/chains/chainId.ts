import type { ChainId as ChainIdType } from "~/types";

export const ChainId = {
  ETHEREUM: 1 as ChainIdType,
  SEPOLIA: 11155111 as ChainIdType,
} as const;

export type ValidChainId = (typeof ChainId)[keyof typeof ChainId];
