import type { GetAppSessionRequest } from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { Effect, Option } from "effect";

export const getAppSessionHandler = (data: GetAppSessionRequest) =>
  Effect.gen(function* () {
    const appSessionRepo = yield* AppSessionRepository;

    if (!data.walletAddress) return { session: null };

    const appSession = yield* appSessionRepo
      .getAppSession(data.walletAddress)
      .pipe(Effect.catchAll(() => Effect.succeed(null)));

    if (!appSession) return { session: null };

    if (Option.isNone(appSession)) return { session: null };
    return { session: appSession.value };
  });
