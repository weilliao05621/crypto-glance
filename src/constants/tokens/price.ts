import { AaveV3Sepolia, AaveV3Ethereum } from "@bgd-labs/aave-address-book";

// constants
import { ChainId, type ValidChainId } from "~/constants/chains/chainId";
import { TOKEN_NAME, type ValidTokenName } from "./list";

// types
import type { Address } from "~/types";

type TOKEN_PRICES_MAP = {
  [C in ValidChainId]: {
    [T in ValidTokenName]: Address;
  };
};

export const AAVE_TOKENS_PRICES: TOKEN_PRICES_MAP = {
  [ChainId.ETHEREUM]: {
    [TOKEN_NAME.AAVE]: AaveV3Ethereum.ASSETS.AAVE.ORACLE as Address,
    [TOKEN_NAME.USDC]: AaveV3Ethereum.ASSETS.USDC.ORACLE as Address,
    [TOKEN_NAME.USDT]: AaveV3Ethereum.ASSETS.USDT.ORACLE as Address,
    [TOKEN_NAME.DAI]: AaveV3Ethereum.ASSETS.DAI.ORACLE as Address,
    [TOKEN_NAME.WETH]: AaveV3Ethereum.ASSETS.WETH.ORACLE as Address,
    [TOKEN_NAME.WBTC]: AaveV3Ethereum.ASSETS.WBTC.ORACLE as Address,
  },
  [ChainId.SEPOLIA]: {
    [TOKEN_NAME.AAVE]: AaveV3Sepolia.ASSETS.AAVE.ORACLE as Address,
    [TOKEN_NAME.USDC]: AaveV3Sepolia.ASSETS.USDC.ORACLE as Address,
    [TOKEN_NAME.USDT]: AaveV3Sepolia.ASSETS.USDT.ORACLE as Address,
    [TOKEN_NAME.DAI]: AaveV3Sepolia.ASSETS.DAI.ORACLE as Address,
    [TOKEN_NAME.WETH]: AaveV3Sepolia.ASSETS.WETH.ORACLE as Address,
    [TOKEN_NAME.WBTC]: AaveV3Sepolia.ASSETS.WBTC.ORACLE as Address,
  },
} as const;
