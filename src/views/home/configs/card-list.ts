export const CARD_ITEM_KEY = {
  CONNECT_WALLET: "connect-wallet",
  ASSET_LIST: "asset-list",
  ASSET_VALUE: "asset-value",
} as const;

const CARD_LIST = [
  {
    content: {
      title: "Connect Wallet",
      subtitle:
        "Connect your cryptocurrency wallet to view your asset portfolio.",
    },
    key: CARD_ITEM_KEY.CONNECT_WALLET,
    layout: {
      columns: 2,
      height: "auto",
    },
  },
  {
    content: {
      title: "Asset List",
      subtitle: "View your cryptocurrency assets and their current value.",
    },
    key: CARD_ITEM_KEY.ASSET_LIST,
    layout: {
      columns: { base: 2, lg: 1 },
      height: "400px",
    },
  },
  {
    content: {
      title: "Asset Value",
      subtitle:
        "Breakdown of your total asset value across different cryptocurrencies.",
    },
    key: CARD_ITEM_KEY.ASSET_VALUE,
    layout: {
      columns: { base: 2, lg: 1 },
      height: "400px",
    },
  },
] as const;

export default CARD_LIST;
