import { useCallback, useMemo } from "react";

import { useBalance, useReadContract, useReadContracts } from "wagmi";

import { IAaveOracle_ABI, IERC20_ABI } from "@bgd-labs/aave-address-book";

// stores
import { useAssetsStore } from "~/stores";

// hooks
import useChainId from "../wagmi/useChainId";

// constants
import {
  AAVE_TOKENS_PRICES,
  TOKEN,
  TOKEN_MAP,
  type ValidToken,
} from "~/constants/tokens";

// types
import type { Address } from "~/types";

export const useGetNativeAssetBalanceQuery = (props: { address: Address }) => {
  const updateAmount = useAssetsStore((state) => state.updateAmount);

  const { refetch } = useBalance({
    address: props.address,
    query: {
      enabled: false,
      // FIX: workaround for source code bug (bigint can't be serializable)
      structuralSharing: false,
    },
  });

  return useCallback(
    () =>
      refetch().then((data) => {
        const amount = data.data?.value;
        if (!amount) return;
        updateAmount(TOKEN.ETH, amount);
      }),
    [refetch, updateAmount],
  );
};

export const useGetErc20AssetBalanceQuery = (props: {
  address: Address;
  token: ValidToken;
  tokenAddress: Address;
}) => {
  const updateAmount = useAssetsStore((state) => state.updateAmount);

  const { refetch } = useReadContract({
    address: props.address,
    abi: IERC20_ABI,
    functionName: "balanceOf",
    args: [props.tokenAddress],
    query: {
      enabled: false,
    },
  });

  return useCallback(
    () =>
      refetch().then((data) => {
        const amount = data.data;
        if (!amount) return;
        updateAmount(props.token, amount);
      }),
    [refetch, updateAmount, props.token],
  );
};

export const useGetAvailableErc20AssetsBalanceQuery = (props: {
  address: Address;
}) => {
  const updateAllAmounts = useAssetsStore((state) => state.updateAllAmounts);

  const chainId = useChainId();

  const tokenList = useMemo(() => Object.values(TOKEN_MAP[chainId]), [chainId]);

  const { refetch } = useReadContracts({
    contracts: tokenList.map((token) => ({
      address: token.address,
      abi: IERC20_ABI,
      functionName: "balanceOf",
      args: [props.address],
    })),
    query: {
      enabled: false,
    },
  });

  return useCallback(
    () =>
      refetch().then((data) => {
        const amounts = data.data;
        if (!amounts) return;

        const amountsMap = new Map(
          amounts.map((item, index) => [
            tokenList[index].symbol,
            item.result as bigint,
          ]),
        );

        updateAllAmounts(amountsMap);
      }),
    [refetch, updateAllAmounts, tokenList],
  );
};

// FIX: currently use ERC-20 for all tokens' price, include BTC & ETH
export const useGetAssetPriceQuery = (props: {
  token: ValidToken;
  tokenAddress: Address;
}) => {
  const updatePrice = useAssetsStore((state) => state.updatePrice);

  const chainId = useChainId();

  const oracle = AAVE_TOKENS_PRICES[chainId];

  const { refetch } = useReadContract({
    address: oracle,
    abi: IAaveOracle_ABI,
    functionName: "getAssetPrice",
    args: [props.tokenAddress],
    query: {
      enabled: false,
    },
  });

  return useCallback(
    () =>
      refetch().then((data) => {
        const price = data.data;
        if (!price) return;
        updatePrice(props.token, price);
      }),
    [refetch, updatePrice, props.token],
  );
};

export const useGetAvailableAssetsPriceQuery = () => {
  const updateAllPrices = useAssetsStore((state) => state.updateAllPrices);

  const chainId = useChainId();

  const oracle = AAVE_TOKENS_PRICES[chainId];
  const tokenList = useMemo(() => Object.values(TOKEN_MAP[chainId]), [chainId]);

  const { refetch } = useReadContract({
    address: oracle,
    abi: IAaveOracle_ABI,
    functionName: "getAssetsPrices",
    args: [tokenList.map((token) => token.address)],
    query: {
      enabled: false,
    },
  });

  return useCallback(
    () =>
      refetch().then((data) => {
        const prices = data.data;
        if (!prices) return;
        const pricesMap = new Map(
          prices.map((price, index) => [tokenList[index].symbol, price]),
        );
        console.log(pricesMap);
        updateAllPrices(pricesMap);
      }),
    [refetch, tokenList, updateAllPrices],
  );
};
