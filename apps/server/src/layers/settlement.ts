// Charge User.
// Settle App Session.

import { RedisCore } from "@envoy1084/effect-redis";
import {
  createECDSAMessageSigner,
  RPCAppStateIntent,
} from "@erc7824/nitrolite";
import {
  ApiKeyNotFound,
  AppSessionNotFound,
  AppSessionUpdateFailed,
  InsufficientBalance,
  PaymentFailed,
} from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { type Address, AddressSchema, type Hex } from "@yellow-rpc/schema";
import { Context, Effect, Layer, Option } from "effect";

import { chargeScript } from "@/helpers";

import { Admin } from "./admin";
import { Encryption } from "./encrypt";
import { Hasher } from "./hash";
import { SettlementQueue } from "./settle-queue";

export class Settlement extends Context.Tag("Settlement")<
  Settlement,
  {
    chargeApiKey: (
      apiKey: string,
    ) => Effect.Effect<
      undefined,
      ApiKeyNotFound | PaymentFailed | InsufficientBalance
    >;
  }
>() {}

export const settleAppSession = (walletAddress: Address) =>
  Effect.gen(function* () {
    const admin = yield* Admin;
    const appSessionRepo = yield* AppSessionRepository;
    const encryption = yield* Encryption;

    // Step 1: Get AppSession
    const appSessionRes = yield* appSessionRepo
      .getAppSession(walletAddress)
      .pipe(
        Effect.catchTag("RedisError", () =>
          Effect.fail(new AppSessionNotFound()),
        ),
      );

    if (Option.isNone(appSessionRes)) {
      return yield* Effect.fail(new AppSessionNotFound());
    }

    const appSession = appSessionRes.value;

    // Step 2: Update AppSession
    const userSessionPrivateKey = yield* encryption.decrypt(
      appSession.userEncSessionPrivateKey,
    );
    const userSessionSigner = createECDSAMessageSigner(
      userSessionPrivateKey as Hex,
    );

    const updateRes = yield* Effect.promise(async () => {
      return await admin.client.submitAppState(
        admin.session.signer,
        [userSessionSigner],
        {
          allocations: [
            {
              amount: appSession.adminBalance.toString(),
              asset: appSession.asset,
              participant: admin.address,
            },
            {
              amount: appSession.userBalance.toString(),
              asset: appSession.asset,
              participant: walletAddress,
            },
          ],
          app_session_id: appSession.appSessionId,
          intent: RPCAppStateIntent.Operate,
          version: appSession.version + 1,
        },
      );
    });

    // Update AppSession
    yield* appSessionRepo
      .updateAppSession(appSession.ownerAddress, {
        pendingSettlement: 0,
        status: updateRes.params.status,
        version: updateRes.params.version,
      })
      .pipe(
        Effect.catchTag("RedisError", (e) =>
          Effect.fail(new AppSessionUpdateFailed({ message: e.message })),
        ),
      );
  });

export const SettlementLive = Layer.effect(
  Settlement,
  Effect.gen(function* () {
    const hasher = yield* Hasher;
    const redis = yield* RedisCore;

    const queue = yield* SettlementQueue;

    const chargeApiKey = (apiKey: string) =>
      Effect.gen(function* () {
        const hashedKey = yield* hasher.hash(apiKey);
        const cost = "0.01";
        const threshold = "1";
        const now = new Date().toISOString();

        // Run Lua Script to Charge App Session
        const res = yield* redis
          .eval(chargeScript, {
            arguments: [hashedKey, cost, threshold, now],
          })
          .pipe(Effect.catchAll(() => Effect.fail(new PaymentFailed())));

        // -- Status Map
        // -- -1: Api Key Not Found
        // -- -2: Session not active
        // -- -3: Insufficient User Balance
        // -- 1: Success
        // -- 2: Needs Settlement
        const [statusCode, walletAddress] = res as [number, `0x${string}`];

        if (statusCode === -1) return yield* Effect.fail(new ApiKeyNotFound());
        if (statusCode === -2) return yield* Effect.fail(new PaymentFailed());
        if (statusCode === -3)
          return yield* Effect.fail(new InsufficientBalance());
        if (statusCode === 2) {
          yield* queue.enqueue(AddressSchema.make(walletAddress));
        }
      });

    return Settlement.of({
      chargeApiKey,
    });
  }),
);
