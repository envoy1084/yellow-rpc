import {
  createECDSAMessageSigner,
  RPCAppStateIntent,
} from "@erc7824/nitrolite";
import {
  AppSessionNotFound,
  AppSessionUpdateFailed,
  InsufficientAvailableBalance,
  type WithdrawFundsRequest,
} from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import type { Hex } from "@yellow-rpc/schema";
import { Effect, Option } from "effect";

import { Admin, Encryption, settleAppSession } from "@/layers";

export const withdrawFundsHandler = (data: WithdrawFundsRequest) =>
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
    const adminSessionPrivateKey = yield* encryption.decrypt(
      appSession.adminEncSessionPrivateKey,
    );
    const adminSessionSigner = createECDSAMessageSigner(
      adminSessionPrivateKey as Hex,
    );

    const userSessionPrivateKey = yield* encryption.decrypt(
      appSession.userEncSessionPrivateKey,
    );
    const userSessionSigner = createECDSAMessageSigner(
      userSessionPrivateKey as Hex,
    );

    const canWithdraw = appSession.userBalance - data.amount >= 0;
    if (!canWithdraw) {
      return yield* Effect.fail(
        new InsufficientAvailableBalance({
          message: "Insufficient Available Balance",
        }),
      );
    }

    const updateParams = yield* Effect.tryPromise({
      catch: (e) => {
        return new AppSessionUpdateFailed({ message: (e as Error).message });
      },
      try: async () => {
        await admin.client.authenticateWithJwt(adminJwt);
        const updateRes = await admin.client.submitAppState(
          userSessionSigner,
          [adminSessionSigner],
          {
            allocations: [
              {
                amount: appSession.adminBalance.toString(),
                asset: appSession.asset,
                participant: admin.address,
              },
              {
                amount: (appSession.userBalance - data.amount).toString(),
                asset: appSession.asset,
                participant: appSession.ownerAddress,
              },
            ],
            app_session_id: appSession.appSessionId,
            intent: RPCAppStateIntent.Withdraw,
            version: appSession.version + 1,
          },
        );

        return updateRes.params;
      },
    });
    // Handle Error, if the deposit fails, it can be due to following reasons:
    // 1. The user has insufficient funds

    yield* appSessionRepo
      .updateAppSession(data.walletAddress, {
        appSessionId: appSession.appSessionId,
        status: updateParams.status,
        userBalance: appSession.userBalance - data.amount,
        version: updateParams.version,
      })
      .pipe(
        Effect.catchTag("RedisError", (e) =>
          Effect.fail(new AppSessionUpdateFailed({ message: e.message })),
        ),
      );

    return { success: true };
  });
