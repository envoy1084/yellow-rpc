import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Atom } from "@effect-atom/atom";
import type { ApiKey } from "@yellow-rpc/schema";
import { Schema } from "effect";

export const userBalanceAtom = Atom.make<number>(0).pipe(Atom.keepAlive);

export const apiKeys = Atom.make<ApiKey[]>([]).pipe(Atom.keepAlive);

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
      privateKey: Schema.String,
    }),
  ),
});
