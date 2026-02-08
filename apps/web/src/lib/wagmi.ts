import { createConfig, http, injected } from "wagmi";
import { mainnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [injected(), metaMask()],
  ssr: false,
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_ALCHEMY_RPC_URL),
  },
});

declare module "wagmi" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: required for wagmi
  interface Register {
    config: typeof wagmiConfig;
  }
}
