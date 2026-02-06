import type { PrepareCreateAppSessionRequest } from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { Effect } from "effect";

export const prepareAppSessionHandler = (
  data: PrepareCreateAppSessionRequest,
) =>
  Effect.gen(function* () {
    const appSessionRepo = yield* AppSessionRepository;

    // TODO: Generate Session Key Pairs
  });
