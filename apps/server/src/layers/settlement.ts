import {
  createECDSAMessageSigner,
  RPCAppStateIntent,
  RPCMethod,
} from "@erc7824/nitrolite";
import { ApiKeyRepository } from "@yellow-rpc/domain/apiKey";
import { decryptAesGcm } from "@yellow-rpc/domain/helpers";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { YellowClient } from "@yellow-rpc/rpc";
import {
  Console,
  Context,
  Effect,
  Layer,
  Option,
  Queue,
  Redacted,
  Ref,
} from "effect";
import type { Address, Hex } from "viem";

import { Env } from "@/env";

import { adminWalletClient } from "../../../../packages/rpc/temp/wallet";
import { Admin } from "./admin";

export class Settlement extends Context.Tag("Settlement")<
  Settlement,
  {
    enqueue: (apiKeyId: string) => Effect.Effect<void>;
  }
>() {}

export const SettlementLive = Layer.scoped(
  Settlement,
  Effect.gen(function* () {
    const env = yield* Env;
    const apiKeyRepo = yield* ApiKeyRepository;
    const appSessionRepo = yield* AppSessionRepository;
    const admin = yield* Admin;

    const queue = yield* Queue.sliding<string>(1000);
    const processing = yield* Ref.make(new Set<string>());

    const enqueue = (apiKeyId: string) =>
      Effect.gen(function* () {
        const set = yield* Ref.get(processing);
        if (set.has(apiKeyId)) {
          return;
        }

        yield* Ref.update(processing, (s) => s.add(apiKeyId));

        yield* Queue.offer(queue, apiKeyId);
      });

    const { sdk, session } = yield* Effect.promise(async () => {
      const sdk = new YellowClient({
        url: env.clearNodeWsUrl,
      });

      await sdk.connect();
      const session = await sdk.authenticate(admin.walletClient, {
        allowances: [],
        application: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 365 days
        scope: "yellow-rpc",
      });

      return { sdk, session };
    });

    const worker = Effect.gen(function* () {
      while (true) {
        const apiKeyId = yield* Queue.take(queue);
        const res = yield* apiKeyRepo.getApiKey(apiKeyId);
        if (Option.isNone(res)) continue;
        const key = res.value;
        const resSession = yield* appSessionRepo.getAppSession(apiKeyId);
        if (Option.isNone(resSession)) continue;

        const appSession = resSession.value;

        const userSigner = createECDSAMessageSigner(
          decryptAesGcm({
            encrypted: appSession.sessionPrivateKey,
            masterKey: Redacted.value(env.adminPrivateKey),
          }) as Hex,
        );

        yield* Console.log(`⚡️ [Worker] Starting settlement for: ${apiKeyId}`);
        const submitRes = yield* Effect.promise(async () => {
          const res = await sdk.submitAppState(session.signer, [userSigner], {
            allocations: [
              {
                amount: String(appSession.adminBalance),
                asset: appSession.asset,
                participant: adminWalletClient.account.address,
              },
              {
                amount: String(appSession.userBalance),
                asset: appSession.asset,
                participant: key.ownerAddress as Address,
              },
            ],
            app_session_id: appSession.id as Hex,
            intent: RPCAppStateIntent.Operate,
            version: appSession.version + 1,
          });

          return res;
        });

        if (submitRes.method === RPCMethod.Error) {
          let status: "expired" | "inactive" = "inactive";
          if (key.expiresAt.getTime() < Date.now()) status = "expired";
          yield* apiKeyRepo.updateApiKey(apiKeyId, {
            status,
          });
          return;
        }

        // Correct Case update AppSession
        yield* appSessionRepo.updateAppSession(apiKeyId, {
          pendingSettlement: 0,
          version: appSession.version + 1,
        });
        yield* Console.log(`✅ [Worker] Settled: ${apiKeyId}`);

        yield* Ref.update(processing, (s) => {
          s.delete(apiKeyId);
          return s;
        });
      }
    });

    yield* Effect.forkScoped(worker);

    return Settlement.of({
      enqueue,
    });
  }),
);
