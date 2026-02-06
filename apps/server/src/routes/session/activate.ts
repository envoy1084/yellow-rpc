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

    // TODO: Create a new AppSession
    const sessionParams = yield* Effect.tryPromise({
      catch: (e) =>
        new AppSessionCreationFailed({ message: (e as Error).message }),

      try: async () => {
        const res = await admin.client.createAppSession(
          admin.session.signer,
          [userSessionSigner],
          {
            allocations: [],
            definition: {
              application: "YellowRPC",
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

    // Update AppSession
    yield* appSessionRepo
      .updateAppSession(data.walletAddress, {
        appSessionId: HexSchema.make(sessionParams.appSessionId),
        status: sessionParams.status,
        version: sessionParams.version,
      })
      .pipe(
        Effect.catchTag("RedisError", (e) =>
          Effect.fail(new AppSessionUpdateFailed({ message: e.message })),
        ),
      );

    return {
      appSessionId: "",
    };
  });
