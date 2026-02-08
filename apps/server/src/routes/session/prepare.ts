import {
  AppSessionCreationFailed,
  type PrepareCreateAppSessionRequest,
} from "@yellow-rpc/api";
import { AppSessionRepository } from "@yellow-rpc/domain/session";
import { generateSession } from "@yellow-rpc/rpc";
import { AddressSchema, HexSchema } from "@yellow-rpc/schema";
import { Duration, Effect, Option } from "effect";

import { Admin, Encryption } from "@/layers";

export const prepareAppSessionHandler = (
  data: PrepareCreateAppSessionRequest,
) =>
  Effect.gen(function* () {
    const admin = yield* Admin;
    const encryption = yield* Encryption;
    const appSessionRepo = yield* AppSessionRepository;

    // Check if App Session already exists
    const existingAppSessionRes = yield* appSessionRepo
      .getAppSession(data.walletAddress)
      .pipe(
        Effect.catchTag("RedisError", (e) =>
          Effect.fail(
            new AppSessionCreationFailed({
              message: e.message,
            }),
          ),
        ),
      );

    if (Option.isSome(existingAppSessionRes)) {
      const existingAppSession = existingAppSessionRes.value;
      const expiresAt = Math.floor(
        new Date(Date.now() + Duration.toMillis(Duration.days(365))).getTime() /
          1000,
      );

      const authParams = JSON.stringify({
        address: data.walletAddress as `0x${string}`,
        allowances: [],
        application: `yellow-rpc-${existingAppSession.id}`,
        expires_at: expiresAt,
        scope: "yellow-rpc.com",
        session_key: existingAppSession.userSessionKey,
      });

      return {
        authParams,
        id: existingAppSession.id,
      };
    }

    const userSession = generateSession();
    const encUserSessionPrivateKey = yield* encryption.encrypt(
      userSession.privateKey,
    );

    const id = crypto.randomUUID();

    const adminSession = yield* Effect.promise(async () => {
      const res = await admin.client.authenticate(admin.walletClient, {
        allowances: [],
        application: `yellow-rpc-${id}`,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 Year
        scope: "yellow-rpc.com",
      });
      return res;
    });

    const encAdminSessionPrivateKey = yield* encryption.encrypt(
      adminSession.privateKey,
    );

    const encAdminJwt = yield* encryption.encrypt(adminSession.jwtToken ?? "");

    yield* appSessionRepo
      .createAppSession(data.walletAddress, {
        adminBalance: 0n,
        adminEncSessionPrivateKey: encAdminSessionPrivateKey,
        adminSessionKey: AddressSchema.make(adminSession.address),
        appSessionId: HexSchema.make("0x0"), // Will be populated after creation
        asset: "ytest.usd",
        createdAt: new Date(),
        encAdminJwt,
        expiresAt: new Date(),
        id,
        ownerAddress: AddressSchema.make(data.walletAddress),
        pendingSettlement: 0n,
        status: "inactive",
        updatedAt: new Date(),
        userBalance: 0n,
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
      allowances: [],
      application: `yellow-rpc-${id}`,
      expires_at: expiresAt,
      scope: "yellow-rpc.com",
      session_key: userSession.address,
    });

    return {
      authParams,
      id,
    };
  });
