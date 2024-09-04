import { create } from "zustand";
import { ValidToken } from "~/constants/tokens";

interface AssetStore {
  amounts: Map<ValidToken, bigint>;
  prices: Map<ValidToken, bigint>;
  updateAmount: (token: ValidToken, amount: bigint) => void;
  updateAllAmounts: (amounts: Map<ValidToken, bigint>) => void;
  updatePrice: (token: ValidToken, price: bigint) => void;
  updateAllPrices: (prices: Map<ValidToken, bigint>) => void;
  getAmount: (token: ValidToken) => bigint;
  getPrice: (token: ValidToken) => bigint;
  getAssetsValueByUsd: () => bigint[];
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
      return { ...state, amounts };
    });
  },
  updatePrice: (token, price) => {
    set((state) => {
      state.amounts.set(token, price);
      return { ...state };
    });
  },
  updateAllPrices: (prices) => {
    set((state) => {
      return { ...state, prices };
    });
  },
  getAmount: (token) => {
    return get().amounts.get(token) ?? 0n;
  },
  getPrice: (token) => {
    return get().prices.get(token) ?? 0n;
  },
  getAssetsValueByUsd: () => {
    const amounts = get().amounts;
    const prices = get().prices;
    const assetsValueByUsd = [];

    for (const [token, amount] of amounts) {
      const price = prices.get(token) ?? 0n;
      assetsValueByUsd.push(amount * price);
    }

    return assetsValueByUsd;
  },
  reset: () => {
    set({ amounts: new Map(), prices: new Map() });
  },
}));
