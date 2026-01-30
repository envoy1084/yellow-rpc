import { layer } from "@effect/experimental/Persistence/Redis";
import { Effect, Layer } from "effect";

import { DatabaseConfig } from "./config";

export const DatabaseLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const config = yield* DatabaseConfig;

    return layer({
      host: config.host,
      port: config.port,
    });
  }),
);
