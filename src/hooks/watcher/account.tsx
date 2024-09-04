import { useEffect } from "react";

import { useAccountEffect } from "wagmi";

// stores
import { useAssetsStore } from "~/stores";

// queries
import {
  useGetAvailableErc20AssetsBalanceQuery,
  useGetNativeAssetBalanceQuery,
} from "../query/assets";

// hooks
import { useAccount } from "../wagmi/useAccount";

export const UpdateAssetsOnAccountConnection = () => {
  const account = useAccount();
  const resetAssetsStore = useAssetsStore((state) => state.reset);

  const getNativeAssetBalanceQuery = useGetNativeAssetBalanceQuery({
    address: account.address,
  });

  const getAvailableErc20AssetsBalanceQuery =
    useGetAvailableErc20AssetsBalanceQuery({
      address: account.address,
    });

  useEffect(() => {
    if (!account.isConnected) return;

    getNativeAssetBalanceQuery();
    getAvailableErc20AssetsBalanceQuery();
  }, [
    account.isConnected,
    getAvailableErc20AssetsBalanceQuery,
    getNativeAssetBalanceQuery,
  ]);

  useAccountEffect({
    onDisconnect: () => {
      resetAssetsStore();
    },
  });

  return null;
};
