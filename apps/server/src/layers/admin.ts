// import type { Session } from "@yellow-rpc/rpc";
import { YellowClient } from "@yellow-rpc/rpc";
import { Context, Effect, Layer, Redacted } from "effect";
import { createWalletClient, type Hex, http, type WalletClient } from "viem";
import { type Address, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import { Env } from "@/env";

export class Admin extends Context.Tag("Admin")<
  Admin,
  {
    walletClient: WalletClient;
    client: YellowClient;
    address: Address;
  }
>() {}

export const AdminLive = Layer.scoped(
  Admin,
  Effect.acquireRelease(
    Effect.gen(function* () {
      const env = yield* Env;
      const account = privateKeyToAccount(
        Redacted.value(env.adminPrivateKey) as Hex,
      );

      const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
      });

      const client = new YellowClient({
        url: env.clearNodeWsUrl,
      });

      const address = account.address;

      return { address, client, walletClient };
    }),
    ({ client }) => Effect.promise(() => client.disconnect()),
  ),
);
