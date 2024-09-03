import { TokenName } from "~/types";

export const TOKEN_NAME = {
  ETH: "ETH" as TokenName,
  AAVE: "AAVE" as TokenName,
  LINK: "LINK" as TokenName,
  DAI: "DAI" as TokenName,
  USDC: "USDC" as TokenName,
  USDT: "USDT" as TokenName,
  WETH: "WETH" as TokenName,
  WBTC: "WBTC" as TokenName,
} as const;

export type ValidTokenName = (typeof TOKEN_NAME)[keyof typeof TOKEN_NAME];
