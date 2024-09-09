import { useLayoutEffect } from "react";

import { useAccount } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";

// configs
import { wagmiConfig, wallectConnectProjectId } from "~/configs/wagmi";
import { Box, Center, useColorMode } from "@chakra-ui/react";

const modal = createWeb3Modal({
  projectId: wallectConnectProjectId,
  wagmiConfig,
  enableAnalytics: false,
  enableOnramp: false,
  enableSwaps: false,
});

const ConnectWallet = () => {
  const account = useAccount();
  const { colorMode } = useColorMode();

  useLayoutEffect(() => {
    modal.setThemeMode(colorMode);
  }, [colorMode]);

  return (
    <Center>
      {account.isConnected ? (
        <>
          <w3m-network-button />
          <Box marginRight={2} />
          <w3m-account-button />
        </>
      ) : (
        <w3m-button />
      )}
    </Center>
  );
};

export default ConnectWallet;
