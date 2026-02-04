import { createConfig, http, injected } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected(), metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

declare module "wagmi" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: required for wagmi
  interface Register {
    config: typeof wagmiConfig;
  }
}
