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
    if (newAllocations === null) return void 0;

    yield* Effect.log("Update AppSession...");
    const updateRes = yield* Effect.tryPromise({
      catch: (e) =>
        new AppSessionUpdateFailed({ message: (e as Error).message }),
      try: async () => {
        await admin.client.authenticateWithJwt(adminJwt);
        const response = await admin.client.submitAppState(
          adminSigner,
          [userSessionSigner],
          {
            allocations: newAllocations,
            app_session_id: appSession.appSessionId,
            intent: props.intent,
            version: appSession.version + 1,
          },
        );

        return { response, success: true };
      },
    }).pipe(
      Effect.catchAll(() =>
        Effect.succeed({
          response: null,
          success: false,
        } as const),
      ),
    );
    yield* Effect.log("updateRes", updateRes);

    if (!updateRes.success) {
      // App Settlement fails due to following reasons:
      // - User Created a new Session key, and invalidate the one in Database
      // - User Session Key is expired (not likely as we do 1 year expiry)
      // - Admin Session Key is expired (not likely as we do 1 year expiry)
      // in all cases we mark the AppSession as invalid
      yield* Effect.logWarning(
        "App Session Settlement Failed, marking as invalid",
      );
      yield* appSessionRepo
        .updateAppSession(walletAddress, {
          status: "invalid",
        })
        .pipe(Effect.catchAll(() => Effect.succeed(undefined)));
      return;
    }

    // Update AppSession
    yield* appSessionRepo
      .updateAppSession(appSession.ownerAddress, {
        pendingSettlement: 0n,
        status: updateRes.response.params.status,
        version: updateRes.response.params.version,
      })
      .pipe(
        Effect.catchTag("RedisError", (e) =>
          Effect.fail(new AppSessionUpdateFailed({ message: e.message })),
        ),
      );
  });
