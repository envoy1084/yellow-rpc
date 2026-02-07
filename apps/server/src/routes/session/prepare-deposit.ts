import {
  createECDSAMessageSigner,
  createSubmitAppStateMessage,
  RPCAppStateIntent,
} from "@erc7824/nitrolite";
import {
  AppSessionNotFound,
  type PrepareDepositFundsRequest,
} from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import type { Hex } from "@yellow-rpc/schema";
import { Effect, Option } from "effect";

import { Admin, Encryption, settleAppSession } from "@/layers";

export const prepareDepositFundsHandler = (data: PrepareDepositFundsRequest) =>
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

    const adminSessionPrivateKey = yield* encryption.decrypt(
      appSession.adminEncSessionPrivateKey,
    );
    const adminSessionSigner = createECDSAMessageSigner(
      adminSessionPrivateKey as Hex,
    );

    const depositMessage = yield* Effect.promise(async () => {
      return await createSubmitAppStateMessage(adminSessionSigner, {
        allocations: [
          {
            amount: appSession.adminBalance.toString(),
            asset: appSession.asset,
            participant: admin.address,
          },
          {
            amount: (appSession.userBalance + data.amount).toString(),
            asset: appSession.asset,
            participant: appSession.ownerAddress,
          },
        ],
        app_session_id: appSession.appSessionId,
        intent: RPCAppStateIntent.Deposit,
        version: appSession.version + 1,
      });
    });

    return { depositMessage };
  });
