import { RedisConnection, RedisCoreLive } from "@yellow-rpc/redis";
import { Effect, Layer, Redacted } from "effect";

import { Env, EnvLive, EnvTest } from "./env";
import { HttpLive } from "./router";

const RedisLayer = RedisCoreLive.pipe(
  Layer.provideMerge(
    Layer.unwrapEffect(
      Effect.gen(function* () {
        const config = yield* Env;

        return RedisConnection.layerWithOptions({
          url: Redacted.value(config.redisUrl),
        });
      }),
    ),
  ),
);

export const YellowRpcLive = HttpLive.pipe(
  Layer.provideMerge(RedisLayer),
  Layer.provideMerge(EnvLive),
);
export const YellowRpcTest = HttpLive.pipe(
  Layer.provideMerge(RedisLayer),
  Layer.provideMerge(EnvTest),
);
