import {
  type ErrorResponse,
  RPCMethod,
  type SubmitAppStateResponse,
} from "@erc7824/nitrolite";
import {
  AppSessionNotFound,
  AppSessionUpdateFailed,
  type ConfirmDepositFundsRequest,
} from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { Effect, Option } from "effect";

import { Admin, Encryption, settleAppSession } from "@/layers";

export const confirmDepositFundsMessageHandler = (
  data: ConfirmDepositFundsRequest,
) =>
  Effect.gen(function* () {
    const admin = yield* Admin;
    const encryption = yield* Encryption;
    const appSessionRepo = yield* AppSessionRepository;

    // Update Pending Settlements
    yield* settleAppSession(data.walletAddress);

    const appSessionRes = yield* appSessionRepo
      .getAppSession(data.walletAddress)
      .pipe(
        Effect.catchTag("RedisError", () =>
          Effect.fail(new AppSessionNotFound()),
        ),
      );

    if (Option.isNone(appSessionRes)) {
      return yield* Effect.fail(new AppSessionNotFound());
    }

    const appSession = appSessionRes.value;

    const adminJwt = yield* encryption.decrypt(appSession.encAdminJwt);

    const updateParams = yield* Effect.tryPromise({
      catch: (e) =>
        new AppSessionUpdateFailed({ message: (e as Error).message }),
      try: async () => {
        await admin.client.authenticateWithJwt(adminJwt);
        const res = await admin.client.sendMessage(data.signedDepositMessage);
        const parsed = JSON.parse(res) as
          | SubmitAppStateResponse
          | ErrorResponse;

        if (parsed.method === RPCMethod.Error) {
          throw new Error(parsed.params.error);
        }

        return parsed.params;
      },
    });

    yield* appSessionRepo
      .updateAppSession(data.walletAddress, {
        appSessionId: appSession.appSessionId,
        status: updateParams.status,
        version: updateParams.version,
      })
      .pipe(
        Effect.catchTag("RedisError", (e) =>
          Effect.fail(new AppSessionUpdateFailed({ message: e.message })),
        ),
      );

    return { success: true };
  });
