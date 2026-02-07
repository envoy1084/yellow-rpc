import { RedisCore } from "@envoy1084/effect-redis";
import { RPCAppStateIntent } from "@erc7824/nitrolite";
import {
  ApiKeyNotFound,
  InsufficientBalance,
  PaymentFailed,
} from "@yellow-rpc/api";
import { type Address, AddressSchema } from "@yellow-rpc/schema";
import { Context, Effect, Layer } from "effect";

import { chargeScript, updateAppSessionState } from "@/helpers";

import { Admin } from "./admin";
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
    yield* updateAppSessionState(walletAddress, {
      createNewAllocations: (appSession) => {
        if (appSession.pendingSettlement === 0) return null;
        return [
          {
            amount: appSession.adminBalance.toString(),
            asset: appSession.asset,
            participant: admin.address,
          },
          {
            amount: appSession.userBalance.toString(),
            asset: appSession.asset,
            participant: appSession.ownerAddress,
          },
        ];
      },
      intent: RPCAppStateIntent.Operate,
    });
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
        const threshold = "0.1";
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

        yield* Effect.log("Settlement Status: ", statusCode);
        yield* Effect.log("Settlement Wallet Address: ", walletAddress);

        if (statusCode === -1) return yield* Effect.fail(new ApiKeyNotFound());
        if (statusCode === -2) return yield* Effect.fail(new PaymentFailed());
        if (statusCode === -3)
          return yield* Effect.fail(new InsufficientBalance());
        if (statusCode === 2) {
          yield* Effect.log("Enqueuing App Session: ", walletAddress);
          yield* queue.enqueue(AddressSchema.make(walletAddress));
        }
      });

    return Settlement.of({
      chargeApiKey,
    });
  }),
);
