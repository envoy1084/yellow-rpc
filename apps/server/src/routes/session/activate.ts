import {
  createECDSAMessageSigner,
  RPCMethod,
  RPCProtocolVersion,
} from "@erc7824/nitrolite";
import {
  type ActivateAppSessionRequest,
  AppSessionCreationFailed,
  AppSessionNotFound,
  AppSessionUpdateFailed,
} from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { HexSchema } from "@yellow-rpc/schema";
import { Effect, Option } from "effect";
import type { Hex } from "viem";

import { Admin, Encryption } from "@/layers";

export const activateAppSessionHandler = (data: ActivateAppSessionRequest) =>
  Effect.gen(function* () {
    const admin = yield* Admin;
    const encryption = yield* Encryption;
    const appSessionRepo = yield* AppSessionRepository;

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

    const userSessionPrivateKey = yield* encryption.decrypt(
      appSession.userEncSessionPrivateKey,
    );
    const userSessionSigner = createECDSAMessageSigner(
      userSessionPrivateKey as Hex,
    );

    const adminJwt = yield* encryption.decrypt(appSession.encAdminJwt);
    const adminSessionPrivateKey = yield* encryption.decrypt(
      appSession.adminEncSessionPrivateKey,
    );
    const adminSessionSigner = createECDSAMessageSigner(
      adminSessionPrivateKey as Hex,
    );

    const sessionParams = yield* Effect.tryPromise({
      catch: (e) =>
        new AppSessionCreationFailed({ message: (e as Error).message }),
      try: async () => {
        await admin.client.authenticateWithJwt(adminJwt);

        const res = await admin.client.createAppSession(
          adminSessionSigner,
          [userSessionSigner],
          {
            allocations: [
              {
                amount: "10",
                asset: "ytest.usd",
                participant: data.walletAddress,
              },
            ],
            definition: {
              application: `yellow-rpc-${data.id}`,
              challenge: 0, // No challenge period
              nonce: Date.now(), // Unique session identifier
              participants: [admin.address, data.walletAddress],
              protocol: RPCProtocolVersion.NitroRPC_0_4,
              quorum: 2, // Requires unanimous agreement
              weights: [1, 1], // Equal voting power
            },
          },
        );

        if (res.method === RPCMethod.Error) {
          throw new Error(res.params.error);
        }

        return res.params;
      },
    });

    const appSessionId = HexSchema.make(sessionParams.appSessionId);

    // Update AppSession
    yield* appSessionRepo
      .updateAppSession(data.walletAddress, {
        appSessionId,
        status: sessionParams.status,
        version: sessionParams.version,
      })
      .pipe(
        Effect.catchTag("RedisError", (e) =>
          Effect.fail(new AppSessionUpdateFailed({ message: e.message })),
        ),
      );

    return {
      appSessionId,
    };
  });
