import { createWeb3Modal } from "@web3modal/wagmi/react";

// hooks
import { useAccount } from "wagmi";

// configs
import { wagmiConfig } from "~/configs/wagmi";
import { Center } from "@chakra-ui/react";

// TODO: change theme mode with useToggleTheme
createWeb3Modal({
  projectId: "123",
  wagmiConfig,
  enableAnalytics: false,
  enableOnramp: false,
  enableSwaps: false,
});

const ConnectWallet = () => {
  const account = useAccount();

  return (
    <Center>
      {account.isConnected ? (
        <>
          <w3m-network-button />
          <w3m-account-button />
        </>
      ) : (
        <w3m-button />
      )}
    </Center>
  );
};

export default ConnectWallet;
