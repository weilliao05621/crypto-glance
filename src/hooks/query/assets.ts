import { useCallback, useMemo } from "react";

import { useBalance, useReadContract, useReadContracts } from "wagmi";

import { IERC20_ABI } from "@bgd-labs/aave-address-book";

// stores
import { useAssetsStore } from "~/stores";

// hooks
import useChainId from "../wagmi/useChainId";

// constants
import { TOKEN, TOKEN_MAP, type ValidToken } from "~/constants/tokens";

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
