import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";

// pages
import HomePage from "./pages/home";

// configs
import { queryClientConfig } from "./configs/tanstack-query";
import { wagmiConfig } from "./configs/wagmi";
import theme from "./configs/theme";

const queryClient = new QueryClient({
  defaultOptions: queryClientConfig,
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ChakraProvider theme={theme}>
          <HomePage />
        </ChakraProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
