import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { queryClientConfig } from "./configs/tanstack-query";
import { wagmiConfig } from "./configs/wagmi";

const queryClient = new QueryClient({
  defaultOptions: queryClientConfig,
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}></WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
