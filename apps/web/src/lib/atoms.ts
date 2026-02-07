import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Atom } from "@effect-atom/atom";
import { Schema } from "effect";

export const unifiedBalanceAtom = Atom.make<string>("0").pipe(Atom.keepAlive);

const runtime = Atom.runtime(BrowserKeyValueStore.layerLocalStorage);

export const sessionAtom = Atom.kvs({
  defaultValue: () => null,
  key: "session-key",
  runtime: runtime,
  schema: Schema.Union(
    Schema.Null,
    Schema.Struct({
      address: Schema.String,
      expiresAt: Schema.Date,
      jwtToken: Schema.String,
      privateKey: Schema.String,
    }),
  ),
});
