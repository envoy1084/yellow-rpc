import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

import { Context, Effect, Layer, Redacted } from "effect";

import { Env } from "@/env";

export class Encryption extends Context.Tag("Encryption")<
  Encryption,
  {
    encrypt: (text: string) => Effect.Effect<string>;
    decrypt: (encrypted: string) => Effect.Effect<string>;
  }
>() {}

export const EncryptionLive = Layer.effect(
  Encryption,
  Effect.gen(function* () {
    const env = yield* Env;

    const masterKey = Buffer.from(Redacted.value(env.masterKey), "hex");

    return Encryption.of({
      decrypt: (encrypted: string) =>
        Effect.sync(() => {
          const data = Buffer.from(encrypted, "hex");
          const iv = data.subarray(0, 12);
          const tag = data.subarray(12, 28);
          const ciphertext = data.subarray(28);

          const decipher = createDecipheriv("aes-256-gcm", masterKey, iv);
          decipher.setAuthTag(tag);

          return Buffer.concat([
            decipher.update(ciphertext),
            decipher.final(),
          ]).toString("utf8");
        }),
      encrypt: (text: string) =>
        Effect.sync(() => {
          const iv = randomBytes(12);
          const cipher = createCipheriv("aes-256-gcm", masterKey, iv);
          const encrypted = Buffer.concat([
            cipher.update(text),
            cipher.final(),
          ]);
          const tag = cipher.getAuthTag();
          return Buffer.concat([iv, tag, encrypted]).toString("hex");
        }),
    });
  }),
);
