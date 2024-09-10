import { useEffect, useRef } from "react";

import { useAccountEffect } from "wagmi";
import { type Address } from "viem";

// stores
import { useAssetsStore } from "~/stores";

// queries
import {
  useGetAvailableAssetsPriceQuery,
  useGetAvailableErc20AssetsBalanceQuery,
  useGetNativeAssetBalanceQuery,
} from "~/hooks/query/assets";

// types
import type { ChainId } from "~/types";

const UpdateAssetsOnAccountConnection = (props: {
  address: Address;
  chainId: ChainId;
  enabled: boolean;
}) => {
  const resetAssetsStore = useAssetsStore((state) => state.reset);

  const prevAccountAddress = useRef<Address | null>(null);
  const prevChain = useRef<ChainId | null>(null);

  const getNativeAssetBalanceQuery = useGetNativeAssetBalanceQuery({
    address: props.address,
    chainId: props.chainId,
  });

  const getAvailableErc20AssetsBalanceQuery =
    useGetAvailableErc20AssetsBalanceQuery({
      address: props.address,
      chainId: props.chainId,
    });

  const getAvailableAssetsPriceQuery = useGetAvailableAssetsPriceQuery({
    chainId: props.chainId,
  });

  useEffect(() => {
    if (!props.enabled) return;

    const shouldFetch =
      prevAccountAddress.current !== props.address ||
      prevChain.current !== props.chainId;

    if (!shouldFetch) {
      return;
    }

    prevChain.current = props.chainId;
    prevAccountAddress.current = props.address;
    getNativeAssetBalanceQuery.refetch();
    getAvailableErc20AssetsBalanceQuery.refetch();
    getAvailableAssetsPriceQuery.refetch();
    console.log("refetching");
  }, [
    props.enabled,
    props.address,
    props.chainId,
    getAvailableErc20AssetsBalanceQuery.refetch,
    getNativeAssetBalanceQuery.refetch,
    getAvailableAssetsPriceQuery.refetch,
    getNativeAssetBalanceQuery,
    getAvailableErc20AssetsBalanceQuery,
    getAvailableAssetsPriceQuery,
  ]);

  useAccountEffect({
    onDisconnect: () => {
      resetAssetsStore();
    },
  });

  return null;
};

export default UpdateAssetsOnAccountConnection;
