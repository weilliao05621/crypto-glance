import { useAccount as useWagmiAccount } from "wagmi";

// types
import type { Address } from "~/types";

export const useAccount = () => {
  const account = useWagmiAccount();

  return {
    ...account,
    address: account.address as Address,
    addresses: account.addresses as Address[],
  };
};
