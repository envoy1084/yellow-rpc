import type { Address } from "@yellow-rpc/schema";
import { Context, Effect, Layer, Queue, Ref } from "effect";

import { settleAppSession } from "./settlement";

export class SettlementQueue extends Context.Tag("SettlementQueue")<
  SettlementQueue,
  {
    enqueue: (walletAddress: Address) => Effect.Effect<void>;
  }
>() {}

export const SettlementQueueLive = Layer.scoped(
  SettlementQueue,
  Effect.gen(function* () {
    const queue = yield* Queue.sliding<Address>(1000);
    const processing = yield* Ref.make(new Set<Address>());

    const enqueue = (walletAddress: Address) =>
      Effect.gen(function* () {
        const set = yield* Ref.get(processing);

        if (set.has(walletAddress)) {
          return;
        }
        // Mark as processing
        yield* Ref.update(processing, (s) => s.add(walletAddress));
        // Add to queue
        yield* Queue.offer(queue, walletAddress);
      });

    const worker = Effect.gen(function* () {
      while (true) {
        const walletAddress = yield* Queue.take(queue);
        yield* Effect.log("Settling App Session: ", walletAddress);
        yield* settleAppSession(walletAddress);
        yield* Effect.log("Settlement Completed: ", walletAddress);
        yield* Ref.update(processing, (s) => {
          s.delete(walletAddress);
          return s;
        });
      }
    });

    yield* Effect.forkScoped(worker);

    return SettlementQueue.of({
      enqueue,
    });
  }),
);
