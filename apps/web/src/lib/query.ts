import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import type { Address } from "viem";

export const queryKeys = createQueryKeyStore({
  apiKeys: {
    list: (walletAddress?: Address) => ({
      queryKey: [walletAddress],
    }),
  },
  appSession: {
    get: (walletAddress?: Address) => ({
      queryKey: [walletAddress],
    }),
  },
  unifiedBalance: {
    get: (walletAddress?: Address) => ({
      queryKey: [walletAddress],
    }),
  },
});
