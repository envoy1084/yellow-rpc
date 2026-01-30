import { Context, Effect, Layer } from "effect";
import ValKey from "iovalkey";

export class Database extends Context.Tag("Database")<Database, ValKey>() {}

import { DatabaseConfig } from "./config";

export const DatabaseLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const config = yield* DatabaseConfig;

    return Layer.scoped(
      Database,
      Effect.acquireRelease(
        Effect.sync(() => new ValKey({ host: config.host, port: config.port })),
        (redis) => Effect.promise(() => redis.quit()),
      ),
    );
  }),
);
