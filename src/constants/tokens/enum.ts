import type { TokenName } from "~/types";

export const TOKEN = {
  ETH: "ETH" as TokenName,
  AAVE: "AAVE" as TokenName,
  LINK: "LINK" as TokenName,
  DAI: "DAI" as TokenName,
  USDC: "USDC" as TokenName,
  USDT: "USDT" as TokenName,
  WETH: "WETH" as TokenName,
  WBTC: "WBTC" as TokenName,
} as const;

type TokenObject = typeof TOKEN;

export type ValidToken = TokenObject[keyof TokenObject];
