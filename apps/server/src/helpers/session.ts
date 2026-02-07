import {
  createECDSAMessageSigner,
  type RPCAppSessionAllocation,
  type RPCAppStateIntent,
} from "@erc7824/nitrolite";
import { AppSessionNotFound, AppSessionUpdateFailed } from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import type { Address, AppSession, Hex } from "@yellow-rpc/schema";
import { Effect, Option } from "effect";

import { Admin, Encryption } from "@/layers";

type UpdateAppSessionStateProps = {
  intent: RPCAppStateIntent;
  createNewAllocations: (
    appSession: AppSession,
  ) => RPCAppSessionAllocation[] | null;
};

export const updateAppSessionState = (
  walletAddress: Address,
  props: UpdateAppSessionStateProps,
) =>
  Effect.gen(function* () {
    const admin = yield* Admin;
    const appSessionRepo = yield* AppSessionRepository;
    const encryption = yield* Encryption;

    const appSessionRes = yield* appSessionRepo
      .getAppSession(walletAddress)
      .pipe(
        Effect.catchTag("RedisError", () =>
          Effect.fail(new AppSessionNotFound()),
        ),
      );

    if (Option.isNone(appSessionRes)) {
      return yield* Effect.fail(new AppSessionNotFound());
    }

    const appSession = appSessionRes.value;

    // Step 2: Update AppSession
    const userSessionPrivateKey = yield* encryption.decrypt(
      appSession.userEncSessionPrivateKey,
    );
    const userSessionSigner = createECDSAMessageSigner(
      userSessionPrivateKey as Hex,
    );

    const adminJwt = yield* encryption.decrypt(appSession.encAdminJwt);
    const adminPrivateKey = yield* encryption.decrypt(
      appSession.adminEncSessionPrivateKey,
    );
    const adminSigner = createECDSAMessageSigner(adminPrivateKey as Hex);

    const newAllocations = props.createNewAllocations(appSession);
    if (newAllocations === null) return;

    yield* Effect.log("Starting App Session Update");
    const updateRes = yield* Effect.tryPromise({
      catch: (e) =>
        new AppSessionUpdateFailed({ message: (e as Error).message }),
      try: async () => {
        await admin.client.authenticateWithJwt(adminJwt);
        return await admin.client.submitAppState(
          adminSigner,
          [userSessionSigner],
          {
            allocations: newAllocations,
            app_session_id: appSession.appSessionId,
            intent: props.intent,
            version: appSession.version + 1,
          },
        );
      },
    });

    yield* Effect.log("App Session Updated", updateRes);

    // Update AppSession
    yield* appSessionRepo
      .updateAppSession(appSession.ownerAddress, {
        pendingSettlement: 0,
        status: updateRes.params.status,
        version: updateRes.params.version,
      })
      .pipe(
        Effect.catchTag("RedisError", (e) =>
          Effect.fail(new AppSessionUpdateFailed({ message: e.message })),
        ),
      );
  });
