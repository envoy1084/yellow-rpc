import {
  AppSessionCreationFailed,
  type PrepareCreateAppSessionRequest,
} from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { generateSession } from "@yellow-rpc/rpc";
import { AddressSchema, HexSchema } from "@yellow-rpc/schema";
import { Duration, Effect } from "effect";
import { zeroAddress } from "viem";

import { Encryption } from "@/layers";

export const prepareAppSessionHandler = (
  data: PrepareCreateAppSessionRequest,
) =>
  Effect.gen(function* () {
    const encryption = yield* Encryption;
    const appSessionRepo = yield* AppSessionRepository;

    const userSession = generateSession();
    const encUserSessionPrivateKey = yield* encryption.encrypt(
      userSession.privateKey,
    );

    const id = crypto.randomUUID();
    yield* appSessionRepo
      .createAppSession(data.walletAddress, {
        adminBalance: 0,
        adminEncSessionPrivateKey: "", // TODO: Generate Encrypted Session Private Key
        adminSessionKey: AddressSchema.make(zeroAddress), // TODO: Generate Session Key
        appSessionId: HexSchema.make("0x0"), // Will be populated after creation
        asset: "ytest.usd",
        createdAt: new Date(),
        encAdminJwt: "test",
        expiresAt: new Date(),
        id,
        ownerAddress: AddressSchema.make(data.walletAddress),
        pendingSettlement: 0,
        status: "inactive",
        updatedAt: new Date(),
        userBalance: 10,
        userEncSessionPrivateKey: encUserSessionPrivateKey,
        userSessionKey: AddressSchema.make(userSession.address),
        version: 0,
      })
      .pipe(
        Effect.catchAll((e) =>
          Effect.fail(
            new AppSessionCreationFailed({
              message: e.message,
            }),
          ),
        ),
      );

    // Make a Auth Message
    const expiresAt = Math.floor(
      new Date(Date.now() + Duration.toMillis(Duration.days(356))).getTime() /
        1000,
    );
    const authParams = JSON.stringify({
      address: data.walletAddress as `0x${string}`,
      allowances: [
        {
          amount: "10",
          asset: "ytest.usd",
          participant: data.walletAddress,
        },
      ],
      application: "YellowRPC",
      expires_at: expiresAt,
      scope: "yellow-rpc.com",
      session_key: userSession.address,
    });

    return {
      authParams,
      id,
    };
  });
