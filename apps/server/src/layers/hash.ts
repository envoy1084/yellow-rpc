import { createHash } from "node:crypto";

import { Context, Effect, Layer } from "effect";

export class Hasher extends Context.Tag("Hasher")<
  Hasher,
  {
    hash: (key: string) => Effect.Effect<string>;
  }
>() {}

export const HasherLive = Layer.effect(
  Hasher,
  Effect.gen(function* () {
    return Hasher.of({
      hash: (key: string) =>
        Effect.sync(() => {
          const encoded = new TextEncoder().encode(key);
          const hash = createHash("sha256").update(encoded).digest("base64url");
          return hash;
        }),
    });
  }),
);
