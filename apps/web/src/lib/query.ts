import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import type { Address } from "@yellow-rpc/schema";

export const queryKeys = createQueryKeyStore({
  appSession: {
    get: (walletAddress?: Address) => ({
      queryKey: [walletAddress],
    }),
  },
});
