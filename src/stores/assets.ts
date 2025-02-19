import { create } from "zustand";
import { ValidToken } from "~/constants/tokens";
import { handleNumberToFloat } from "~/utils/unit";

type Amount = {
  value: bigint;
  decimals: bigint;
};

type AssetValueByUsd = {
  asset: ValidToken;
  value: string;
};

const AAVE_USD_DECIMALS = 8;
const TO_AAVE_USD_DECIMALS = Math.pow(10, AAVE_USD_DECIMALS);

interface AssetStore {
  amounts: Map<ValidToken, Amount>;
  prices: Map<ValidToken, bigint>;
  updateAmount: (token: ValidToken, amount: Amount) => void;
  updateAllAmounts: (amounts: Array<[ValidToken, Amount]>) => void;
  updatePrice: (token: ValidToken, price: bigint) => void;
  updateAllPrices: (prices: Map<ValidToken, bigint>) => void;
  getAmount: (token: ValidToken) => Amount;
  getPrice: (token: ValidToken) => string;
  getAssetsValueByUsd: () => AssetValueByUsd[];
  reset: () => void;
}

export const useAssetsStore = create<AssetStore>((set, get) => ({
  amounts: new Map(),
  prices: new Map(),
  updateAmount: (token, amount) => {
    set((state) => {
      state.amounts.set(token, amount);
      return { ...state };
    });
  },
  updateAllAmounts: (amounts) => {
    set((state) => {
      amounts.forEach((item) => {
        state.amounts.set(item[0], item[1]);
      });
      return { ...state };
    });
  },
  updatePrice: (token, price) => {
    set((state) => {
      state.prices.set(token, price);
      return { ...state };
    });
  },
  updateAllPrices: (prices) => {
    set((state) => {
      return { ...state, prices };
    });
  },
  getAmount: (token) => {
    return get().amounts.get(token) ?? { value: 0n, decimals: 0n };
  },
  getPrice: (token) => {
    const priceSource = get().prices.get(token) ?? 0n;
    const toDecimals = `${parseFloat(priceSource.toString()) / TO_AAVE_USD_DECIMALS}`;
    const price = handleNumberToFloat(toDecimals);
    return price;
  },
  getAssetsValueByUsd: () => {
    const amounts = get().amounts;
    const prices = get().prices;
    const assetsValueByUsd = [];

    for (const [token, amount] of amounts) {
      const price = prices.get(token) ?? 0n;
      const toDecimals = 10n ** BigInt(amount.decimals);

      assetsValueByUsd.push({
        asset: token,
        value: `${+((amount.value * price) / toDecimals).toString() / TO_AAVE_USD_DECIMALS}`,
      });
    }
    return assetsValueByUsd;
  },
  reset: () => {
    set({ amounts: new Map(), prices: new Map() });
  },
}));
