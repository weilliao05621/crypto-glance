import { useCallback, useMemo } from "react";

import { useBalance, useReadContract, useReadContracts } from "wagmi";
import { type Address } from "viem";

import { IAaveOracle_ABI, IERC20_ABI } from "@bgd-labs/aave-address-book";

// stores
import { useAssetsStore } from "~/stores";

// constants
import {
  AAVE_TOKENS_PRICES,
  AVAILABLE_NATIVE_TOKEN,
  TOKEN,
  TOKEN_MAP,
  type ValidToken,
} from "~/constants/tokens";

// types
import type { ChainId } from "~/types";

const ETHEREUM_DECIMALS = 18n;
const AAVE_USD_DECIMALS = 8n;
const TO_AAVE_USD_DECIMALS = 10n ** AAVE_USD_DECIMALS;

export const useGetNativeAssetBalanceQuery = (props: {
  address?: Address;
  chainId: ChainId;
}) => {
  const updateAmount = useAssetsStore((state) => state.updateAmount);

  const { refetch } = useBalance({
    address: props?.address,
    chainId: props.chainId,
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
        if (amount === undefined) return;

        updateAmount(TOKEN_MAP[props.chainId][TOKEN.ETH].symbol, {
          value: amount,
          decimals: ETHEREUM_DECIMALS,
        });
      }),
    [props.chainId, refetch, updateAmount],
  );
};

export const useGetErc20AssetBalanceQuery = (props: {
  address?: Address;
  chainId: ChainId;
  token?: ValidToken;
}) => {
  const updateAmount = useAssetsStore((state) => state.updateAmount);

  const { refetch } = useReadContract({
    address: props.token
      ? TOKEN_MAP[props.chainId][props.token].address
      : undefined,
    abi: IERC20_ABI,
    functionName: "balanceOf",
    args: props?.address ? [props.address] : undefined,
    query: {
      enabled: false,
    },
  });

  return useCallback(
    () =>
      refetch().then((data) => {
        if (!props.token) return;
        const value = data.data;
        if (value === undefined) return;

        updateAmount(props.token, {
          value,
          decimals: BigInt(TOKEN_MAP[props.chainId][props.token].decimals),
        });
      }),
    [refetch, updateAmount, props.token, props.chainId],
  );
};

export const useGetAssetBalanceQuery = (props: {
  address?: Address;
  chainId: ChainId;
  token?: ValidToken;
}) => {
  const queryNativeBalance = useGetNativeAssetBalanceQuery({
    address: props.address,
    chainId: props.chainId,
  });
  const queryErc20Balance = useGetErc20AssetBalanceQuery({
    address: props.address,
    chainId: props.chainId,
    token: props.token,
  });

  return useCallback(
    async (type: ValidToken) => {
      const native = AVAILABLE_NATIVE_TOKEN[props.chainId];
      switch (type) {
        case native: {
          await queryNativeBalance();
          break;
        }

        default:
          await queryErc20Balance();
          break;
      }
    },
    [queryNativeBalance, queryErc20Balance, props.chainId],
  );
};

type GetAvailableErc20AssetsBalanceQueryData = Array<{
  result: bigint | undefined;
}>;

// treat all tokens as ERC-20
export const useGetAvailableErc20AssetsBalanceQuery = (props: {
  address: Address;
  chainId: ChainId;
}) => {
  const updateAllAmounts = useAssetsStore((state) => state.updateAllAmounts);

  const tokenList = useMemo(
    () =>
      Object.values(TOKEN_MAP[props.chainId]).filter((item) => !!item.address),
    [props.chainId],
  );

  const { refetch } = useReadContracts<
    GetAvailableErc20AssetsBalanceQueryData,
    never,
    never,
    GetAvailableErc20AssetsBalanceQueryData
  >({
    contracts: tokenList.map((token) => {
      return {
        address: token.address!,
        abi: IERC20_ABI,
        functionName: "balanceOf",
        args: [props.address],
      };
    }),
    query: {
      enabled: false,
    },
  });

  return useCallback(
    () =>
      refetch().then((data) => {
        const results = data.data;
        if (!Array.isArray(results)) return;

        const forMapping: [ValidToken, { value: bigint; decimals: bigint }][] =
          tokenList.map((token, index) => [
            token.symbol,
            {
              value: results[index].result ?? 0n,
              decimals: BigInt(TOKEN_MAP[props.chainId][token.symbol].decimals),
            },
          ]);

        updateAllAmounts(forMapping);
      }),
    [refetch, updateAllAmounts, props.chainId, tokenList],
  );
};

export const useGetAvailableAssetsPriceQuery = (props: {
  chainId: ChainId;
}) => {
  const updateAllPrices = useAssetsStore((state) => state.updateAllPrices);

  const oracle = AAVE_TOKENS_PRICES[props.chainId];
  const tokenList = useMemo(
    () =>
      Object.values(TOKEN_MAP[props.chainId]).filter((item) => !!item.address),
    [props.chainId],
  );

  const { refetch } = useReadContract({
    address: oracle,
    abi: IAaveOracle_ABI,
    functionName: "getAssetsPrices",
    args: [tokenList.map((token) => token.address!)],
    query: {
      enabled: false,
    },
  });

  return useCallback(
    () =>
      refetch().then((data) => {
        const prices = data.data;
        if (!Array.isArray(prices)) return;

        const pricesMap = new Map(
          tokenList.map((token, index) => [
            token.symbol,
            prices[index] / TO_AAVE_USD_DECIMALS,
          ]),
        );

        // FIX: currently use ERC-20 for all tokens' price, include BTC & ETH
        pricesMap.set(TOKEN.ETH, pricesMap.get(TOKEN.WETH) ?? 0n);

        updateAllPrices(pricesMap);
      }),
    [refetch, tokenList, updateAllPrices],
  );
};
