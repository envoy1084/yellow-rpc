import type { SupportedChain } from "@namespace/sdk";

import { BaseIcon } from "./base";
import { EthereumIcon } from "./ethereum";
import { OptimismIcon } from "./optimism";

export const ChainIcon = ({
  chain,
  ...props
}: React.SVGProps<SVGSVGElement> & { chain: SupportedChain }) => {
  if (chain === "mainnet" || chain === "sepolia") {
    return <EthereumIcon {...props} />;
  }
  if (chain === "optimism") {
    return <OptimismIcon {...props} />;
  }
  if (chain === "base" || chain === "baseSepolia") {
    return <BaseIcon {...props} />;
  }

  return <EthereumIcon {...props} />;
};
