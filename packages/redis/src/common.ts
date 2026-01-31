/** biome-ignore-all lint/suspicious/noExplicitAny: safe */
import { Effect } from "effect";

import { RedisError } from "./errors";

export type Effectify<
  F extends (...args: any[]) => Promise<any>,
  E = RedisError,
> = (...args: Parameters<F>) => Effect.Effect<Awaited<ReturnType<F>>, E>;

export const effectify = <
  F extends (...args: any[]) => Promise<any>,
  E = RedisError,
>(
  fn: F,
): Effectify<F, E> => {
  return ((...args: Parameters<F>) =>
    Effect.tryPromise({
      catch: (e) => new RedisError({ cause: e }),
      try: () => fn(...args),
    })) as any;
};
