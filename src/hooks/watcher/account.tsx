import { useEffect } from "react";

import { useAccountEffect } from "wagmi";

// stores
import { useAssetsStore } from "~/stores";

// queries
import {
  useGetAvailableAssetsPriceQuery,
  useGetAvailableErc20AssetsBalanceQuery,
  useGetNativeAssetBalanceQuery,
} from "../query/assets";

// types
import type { Address, ChainId } from "~/types";

export const UpdateAssetsOnAccountConnection = (props: {
  address: Address;
  chainId: ChainId;
  enabled: boolean;
}) => {
  const resetAssetsStore = useAssetsStore((state) => state.reset);

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

    getNativeAssetBalanceQuery();
    getAvailableErc20AssetsBalanceQuery();
    getAvailableAssetsPriceQuery();
  }, [
    props.enabled,
    getAvailableErc20AssetsBalanceQuery,
    getNativeAssetBalanceQuery,
    getAvailableAssetsPriceQuery,
    resetAssetsStore,
  ]);

  useAccountEffect({
    onDisconnect: () => {
      resetAssetsStore();
    },
  });

  return null;
};
