import type { SupportedChain } from "@yellow-rpc/schema";

export const getAlchemyUrl = (chain: SupportedChain, token: string) => {
  if (chain === "ethereum") {
    return `https://eth-mainnet.g.alchemy.com/v2/${token}`;
  }
  if (chain === "optimism") {
    return `https://opt-mainnet.g.alchemy.com/v2/${token}`;
  }

  if (chain === "base") {
    return `https://base-mainnet.g.alchemy.com/v2/${token}`;
  }

  return "";
};
