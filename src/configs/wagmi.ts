import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// has setup whitelist
const INFURA_KEY = import.meta.env.VITE_INFURA_KEY;
export const wallectConnectProjectId = import.meta.env
  .VITE_WALLET_CONNECT_PROJECT_ID;

const mainnetHttp = INFURA_KEY
  ? http(`https://mainnet.infura.io/v3/${INFURA_KEY}`)
  : http();

const sepoliaHttp = INFURA_KEY
  ? http(`https://sepolia.infura.io/v3/${INFURA_KEY}`)
  : http();

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: mainnetHttp,
    [sepolia.id]: sepoliaHttp,
  },
  connectors: [
    injected(),
    walletConnect({ projectId: wallectConnectProjectId, showQrModal: false }),
  ],
});
