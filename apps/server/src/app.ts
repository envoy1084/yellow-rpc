import { layerWithOptions, RedisCoreLive } from "@envoy1084/effect-redis";
import { Effect, Layer, Redacted } from "effect";

import { Env, EnvLive } from "./env";
import { HttpLive } from "./router";

const RedisLayer = RedisCoreLive.pipe(
  Layer.provideMerge(
    Layer.unwrapEffect(
      Effect.gen(function* () {
        const config = yield* Env;
        return layerWithOptions({
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
