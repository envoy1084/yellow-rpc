import type { PropsWithChildren } from "react";

import { ThemeProvider } from "./theme";
import { Web3Provider } from "./web3";
import { YellowProvider } from "./yellow";

export const ProviderTree = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="yellow-rpc-ui-theme">
      <Web3Provider>
        <YellowProvider>{children}</YellowProvider>
      </Web3Provider>
    </ThemeProvider>
  );
};
