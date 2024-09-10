import { type ComponentType, type SVGProps } from "react";

import { AaveV3Ethereum, AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { type Address } from "viem";

// constants
import { CHAIN_ID, type ValidChainId } from "../chains/chainId";
import { TOKEN, type ValidToken } from "./enum";

// images
import AaveIcon from "~/assets/icons/tokens/aave-mono.svg?react";
import UsdcIcon from "~/assets/icons/tokens/usd-coin-mono.svg?react";
import DaiIcon from "~/assets/icons/tokens/dai-mono.svg?react";
import EthereumIcon from "~/assets/icons/tokens/ethereum-mono.svg?react";
import UsdtIcon from "~/assets/icons/tokens/tether-mono.svg?react";
import WbtcIcon from "~/assets/icons/tokens/wrapped-bitcoin-mono.svg?react";

type TOKEN_LIST_MAP = {
  [C in ValidChainId]: {
    [T in ValidToken]: {
      name: string;
      symbol: ValidToken;
      icon: ComponentType<SVGProps<SVGSVGElement>>;
      address?: Address;
      decimals: number;
    };
  };
};

const TOKEN_NAME_MAP = {
  [TOKEN.ETH]: "Ether",
  [TOKEN.AAVE]: "Aave",
  [TOKEN.USDC]: "USD Coin",
  [TOKEN.USDT]: "Tether",
  [TOKEN.DAI]: "DAI",
  [TOKEN.WETH]: "Wrapped Ether",
  [TOKEN.WBTC]: "Wrapped Bitcoin",
} as const;

const TOKEN_ICON_MAP = {
  [TOKEN.ETH]: EthereumIcon,
  [TOKEN.AAVE]: AaveIcon,
  [TOKEN.USDC]: UsdcIcon,
  [TOKEN.USDT]: UsdtIcon,
  [TOKEN.DAI]: DaiIcon,
  [TOKEN.WETH]: EthereumIcon,
  [TOKEN.WBTC]: WbtcIcon,
} as const;

export const TOKEN_MAP: TOKEN_LIST_MAP = {
  [CHAIN_ID.ETHEREUM]: {
    [TOKEN.ETH]: {
      name: TOKEN_NAME_MAP[TOKEN.ETH],
      symbol: TOKEN.ETH,
      icon: TOKEN_ICON_MAP[TOKEN.ETH],
      decimals: 18,
    },
    [TOKEN.AAVE]: {
      name: TOKEN_NAME_MAP[TOKEN.AAVE],
      symbol: TOKEN.AAVE,
      icon: TOKEN_ICON_MAP[TOKEN.AAVE],
      address: AaveV3Ethereum.ASSETS.AAVE.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.AAVE.decimals,
    },
    [TOKEN.USDC]: {
      name: TOKEN_NAME_MAP[TOKEN.USDC],
      symbol: TOKEN.USDC,
      icon: TOKEN_ICON_MAP[TOKEN.USDC],
      address: AaveV3Ethereum.ASSETS.USDC.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.USDC.decimals,
    },
    [TOKEN.USDT]: {
      name: TOKEN_NAME_MAP[TOKEN.USDT],
      symbol: TOKEN.USDT,
      icon: TOKEN_ICON_MAP[TOKEN.USDT],
      address: AaveV3Ethereum.ASSETS.USDT.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.USDT.decimals,
    },
    [TOKEN.DAI]: {
      name: TOKEN_NAME_MAP[TOKEN.DAI],
      symbol: TOKEN.DAI,
      icon: TOKEN_ICON_MAP[TOKEN.DAI],
      address: AaveV3Ethereum.ASSETS.DAI.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.DAI.decimals,
    },
    [TOKEN.WETH]: {
      name: TOKEN_NAME_MAP[TOKEN.WETH],
      symbol: TOKEN.WETH,
      icon: TOKEN_ICON_MAP[TOKEN.WETH],
      address: AaveV3Ethereum.ASSETS.WETH.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.WETH.decimals,
    },
    [TOKEN.WBTC]: {
      name: TOKEN_NAME_MAP[TOKEN.WBTC],
      symbol: TOKEN.WBTC,
      icon: TOKEN_ICON_MAP[TOKEN.WBTC],
      address: AaveV3Ethereum.ASSETS.WBTC.UNDERLYING as Address,
      decimals: AaveV3Ethereum.ASSETS.WBTC.decimals,
    },
  },
  [CHAIN_ID.SEPOLIA]: {
    [TOKEN.ETH]: {
      name: TOKEN_NAME_MAP[TOKEN.ETH],
      symbol: TOKEN.ETH,
      icon: TOKEN_ICON_MAP[TOKEN.ETH],
      decimals: 18,
    },
    [TOKEN.AAVE]: {
      name: TOKEN_NAME_MAP[TOKEN.AAVE],
      symbol: TOKEN.AAVE,
      icon: TOKEN_ICON_MAP[TOKEN.AAVE],
      address: AaveV3Sepolia.ASSETS.AAVE.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.AAVE.decimals,
    },
    [TOKEN.USDC]: {
      name: TOKEN_NAME_MAP[TOKEN.USDC],
      symbol: TOKEN.USDC,
      icon: TOKEN_ICON_MAP[TOKEN.USDC],
      address: AaveV3Sepolia.ASSETS.USDC.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.USDC.decimals,
    },
    [TOKEN.USDT]: {
      name: TOKEN_NAME_MAP[TOKEN.USDT],
      symbol: TOKEN.USDT,
      icon: TOKEN_ICON_MAP[TOKEN.USDT],
      address: AaveV3Sepolia.ASSETS.USDT.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.USDT.decimals,
    },
    [TOKEN.DAI]: {
      name: TOKEN_NAME_MAP[TOKEN.DAI],
      symbol: TOKEN.DAI,
      icon: TOKEN_ICON_MAP[TOKEN.DAI],
      address: AaveV3Sepolia.ASSETS.DAI.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.DAI.decimals,
    },
    [TOKEN.WETH]: {
      name: TOKEN_NAME_MAP[TOKEN.WETH],
      symbol: TOKEN.WETH,
      icon: TOKEN_ICON_MAP[TOKEN.WETH],
      address: AaveV3Sepolia.ASSETS.WETH.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.WETH.decimals,
    },
    [TOKEN.WBTC]: {
      name: TOKEN_NAME_MAP[TOKEN.WBTC],
      symbol: TOKEN.WBTC,
      icon: TOKEN_ICON_MAP[TOKEN.WBTC],
      address: AaveV3Sepolia.ASSETS.WBTC.UNDERLYING as Address,
      decimals: AaveV3Sepolia.ASSETS.WBTC.decimals,
    },
  },
} as const;

export const AVAILABLE_NATIVE_TOKEN: {
  [C in ValidChainId]: Pick<typeof TOKEN, "ETH">["ETH"];
} = {
  [CHAIN_ID.ETHEREUM]: TOKEN.ETH,
  [CHAIN_ID.SEPOLIA]: TOKEN.ETH,
} as const;
