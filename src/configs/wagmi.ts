import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// has setup whitelist
const INFURA_KEY = import.meta.env.VITE_INFURA_KEY;

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
  // TODO: may support wallet connect later. Register project on https://cloud.walletconnect.com/sign-in
  connectors: [injected()],
});
