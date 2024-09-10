import { useEffect } from "react";

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

    getNativeAssetBalanceQuery.refetch();
    getAvailableErc20AssetsBalanceQuery.refetch();
    getAvailableAssetsPriceQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.enabled,
    getAvailableErc20AssetsBalanceQuery.refetch,
    getNativeAssetBalanceQuery.refetch,
    getAvailableAssetsPriceQuery.refetch,
    resetAssetsStore,
  ]);

  useAccountEffect({
    onDisconnect: () => {
      resetAssetsStore();
    },
  });

  return null;
};

export default UpdateAssetsOnAccountConnection;
