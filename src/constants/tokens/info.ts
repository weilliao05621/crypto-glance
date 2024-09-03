import { AaveV3Ethereum, AaveV3Sepolia } from "@bgd-labs/aave-address-book";

// constants
import { ChainId, type ValidChainId } from "../chains/chainId";
import { TOKEN_NAME, type ValidTokenName } from "./list";

// types
import type { Address } from "~/types";

type TOKEN_INFO_MAP = {
  [C in ValidChainId]: {
    [T in ValidTokenName]: {
      symbol: ValidTokenName;
      // TODO: will fix icon's typing
      icon: string;
      address: Address;
    };
  };
};

export const TOKEN_INFO: TOKEN_INFO_MAP = {
  [ChainId.ETHEREUM]: {
    [TOKEN_NAME.AAVE]: {
      symbol: TOKEN_NAME.AAVE,
      icon: "",
      address: AaveV3Ethereum.ASSETS.AAVE.UNDERLYING as Address,
    },
    [TOKEN_NAME.USDC]: {
      symbol: TOKEN_NAME.USDC,
      icon: "",
      address: AaveV3Ethereum.ASSETS.USDC.UNDERLYING as Address,
    },
    [TOKEN_NAME.USDT]: {
      symbol: TOKEN_NAME.USDT,
      icon: "",
      address: AaveV3Ethereum.ASSETS.USDT.UNDERLYING as Address as Address,
    },
    [TOKEN_NAME.DAI]: {
      symbol: TOKEN_NAME.DAI,
      icon: "",
      address: AaveV3Ethereum.ASSETS.DAI.UNDERLYING as Address,
    },
    [TOKEN_NAME.WETH]: {
      symbol: TOKEN_NAME.WETH,
      icon: "",
      address: AaveV3Ethereum.ASSETS.WETH.UNDERLYING as Address,
    },
    [TOKEN_NAME.WBTC]: {
      symbol: TOKEN_NAME.WBTC,
      icon: "",
      address: AaveV3Ethereum.ASSETS.WBTC.UNDERLYING as Address,
    },
  },
  [ChainId.SEPOLIA]: {
    [TOKEN_NAME.AAVE]: {
      symbol: TOKEN_NAME.AAVE,
      icon: "",
      address: AaveV3Sepolia.ASSETS.AAVE.UNDERLYING as Address,
    },
    [TOKEN_NAME.USDC]: {
      symbol: TOKEN_NAME.USDC,
      icon: "",
      address: AaveV3Sepolia.ASSETS.USDC.UNDERLYING as Address,
    },
    [TOKEN_NAME.USDT]: {
      symbol: TOKEN_NAME.USDT,
      icon: "",
      address: AaveV3Sepolia.ASSETS.USDT.UNDERLYING as Address,
    },
    [TOKEN_NAME.DAI]: {
      symbol: TOKEN_NAME.DAI,
      icon: "",
      address: AaveV3Sepolia.ASSETS.DAI.UNDERLYING as Address,
    },
    [TOKEN_NAME.WETH]: {
      symbol: TOKEN_NAME.WETH,
      icon: "",
      address: AaveV3Sepolia.ASSETS.WETH.UNDERLYING as Address,
    },
    [TOKEN_NAME.WBTC]: {
      symbol: TOKEN_NAME.WBTC,
      icon: "",
      address: AaveV3Sepolia.ASSETS.WBTC.UNDERLYING as Address,
    },
  },
} as const;
