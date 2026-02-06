import { createRandomStringGenerator } from "@yellow-rpc/domain/helpers";
import { Context, Effect, Layer } from "effect";

export class KeyGenerator extends Context.Tag("KeyGenerator")<
  KeyGenerator,
  {
    generateKey: (prefix: string, length: number) => Effect.Effect<string>;
  }
>() {}

export const KeyGeneratorLive = Layer.effect(
  KeyGenerator,
  Effect.gen(function* () {
    return KeyGenerator.of({
      generateKey: (prefix, keyLen) =>
        Effect.sync(() => {
          let len = keyLen - prefix.length;
          if (len <= 0) len = 32;
          const key = createRandomStringGenerator("a-z", "A-Z", "0-9")(len);
          return `${prefix}${key}`;
        }),
    });
  }),
);
