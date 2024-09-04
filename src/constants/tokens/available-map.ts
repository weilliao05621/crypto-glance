import { AaveV3Ethereum, AaveV3Sepolia } from "@bgd-labs/aave-address-book";

// constants
import { ChainId, type ValidChainId } from "../chains/chainId";
import { TOKEN, type ValidToken } from "./enum";

// types
import type { Address } from "~/types";

type TOKEN_LIST_MAP = {
  [C in ValidChainId]: {
    [T in ValidToken]: {
      name: ValidToken;
      symbol: ValidToken;
      // TODO: will fix icon's typing
      icon: string;
      address: Address;
      decimals: number;
    };
  };
};

export const TOKEN_MAP: TOKEN_LIST_MAP = {
  [ChainId.ETHEREUM]: {
    [TOKEN.AAVE]: {
      name: TOKEN.AAVE,
      symbol: TOKEN.AAVE,
      icon: "",
      address: AaveV3Ethereum.ASSETS.AAVE.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.AAVE.decimals,
    },
    [TOKEN.USDC]: {
      name: TOKEN.USDC,
      symbol: TOKEN.USDC,
      icon: "",
      address: AaveV3Ethereum.ASSETS.USDC.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.USDC.decimals,
    },
    [TOKEN.USDT]: {
      name: TOKEN.USDT,
      symbol: TOKEN.USDT,
      icon: "",
      address: AaveV3Ethereum.ASSETS.USDT.UNDERLYING as Address as Address,
      decimals: AaveV3Ethereum.ASSETS.USDT.decimals,
    },
    [TOKEN.DAI]: {
      name: TOKEN.DAI,
      symbol: TOKEN.DAI,
      icon: "",
      address: AaveV3Ethereum.ASSETS.DAI.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.DAI.decimals,
    },
    [TOKEN.WETH]: {
      name: TOKEN.WETH,
      symbol: TOKEN.WETH,
      icon: "",
      address: AaveV3Ethereum.ASSETS.WETH.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.WETH.decimals,
    },
    [TOKEN.WBTC]: {
      name: TOKEN.WBTC,
      symbol: TOKEN.WBTC,
      icon: "",
      address: AaveV3Ethereum.ASSETS.WBTC.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.WBTC.decimals,
    },
  },
  [ChainId.SEPOLIA]: {
    [TOKEN.AAVE]: {
      name: TOKEN.AAVE,
      symbol: TOKEN.AAVE,
      icon: "",
      address: AaveV3Sepolia.ASSETS.AAVE.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.AAVE.decimals,
    },
    [TOKEN.USDC]: {
      name: TOKEN.USDC,
      symbol: TOKEN.USDC,
      icon: "",
      address: AaveV3Sepolia.ASSETS.USDC.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.USDC.decimals,
    },
    [TOKEN.USDT]: {
      name: TOKEN.USDT,
      symbol: TOKEN.USDT,
      icon: "",
      address: AaveV3Sepolia.ASSETS.USDT.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.USDT.decimals,
    },
    [TOKEN.DAI]: {
      name: TOKEN.DAI,
      symbol: TOKEN.DAI,
      icon: "",
      address: AaveV3Sepolia.ASSETS.DAI.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.DAI.decimals,
    },
    [TOKEN.WETH]: {
      name: TOKEN.WETH,
      symbol: TOKEN.WETH,
      icon: "",
      address: AaveV3Sepolia.ASSETS.WETH.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.WETH.decimals,
    },
    [TOKEN.WBTC]: {
      name: TOKEN.WBTC,
      symbol: TOKEN.WBTC,
      icon: "",
      address: AaveV3Sepolia.ASSETS.WBTC.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.WBTC.decimals,
    },
  },
} as const;
