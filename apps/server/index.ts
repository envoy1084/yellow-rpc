import { runMain } from "@effect/platform-node/NodeRuntime";
import { RedisConnection, RedisCore, RedisCoreLive } from "@yellow-rpc/redis";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  const redis = yield* RedisCore;

  console.log("=== ASYNC ===");
  yield* redis.set.sAdd("my-set", "hello");
  yield* redis.set.sAdd("my-set", "world");

  const members = yield* redis.set.sMembers("my-set");
  console.log("members:", members);

  console.log("\n=== MULTI ===");
  const count = yield* redis.multi((tx) =>
    Effect.gen(function* () {
      yield* tx.set.sAdd("tx-set", "a");
      yield* tx.set.sAdd("tx-set", "b");

      // ❌ Uncommenting this should FAIL to compile:
      // const m = yield* tx.set.sMembers("tx-set");

      return 2;
    }),
  );
  console.log("tx returned:", count);

  console.log("\n=== PIPELINE ===");
  yield* redis.pipeline((tx) =>
    Effect.all([
      tx.json.set("doc", "$", { items: [] }),
      tx.json.arrAppend("doc", "$.items", 1),
      tx.json.arrAppend("doc", "$.items", 2),
    ]),
  );

  const doc = yield* redis.json.get("doc");
  console.log("doc:", doc);
});

program.pipe(
  Effect.provide(RedisCoreLive),
  Effect.provide(
    RedisConnection.layerWithOptions({
      url: "redis://localhost:6379",
    }),
  ),
  runMain,
);
