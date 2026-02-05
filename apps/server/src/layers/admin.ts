import { Context, Effect, Layer, Redacted } from "effect";
import { createWalletClient, type Hex, http, type WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

import { Env } from "@/env";

export class Admin extends Context.Tag("Admin")<
  Admin,
  {
    walletClient: WalletClient;
  }
>() {}

export const AdminLive = Layer.effect(
  Admin,
  Effect.gen(function* () {
    const env = yield* Env;

    const account = privateKeyToAccount(
      Redacted.value(env.adminPrivateKey) as Hex,
    );

    const walletClient = createWalletClient({
      account,
      chain: mainnet,
      transport: http(),
    });

    return Admin.of({ walletClient });
  }),
);
