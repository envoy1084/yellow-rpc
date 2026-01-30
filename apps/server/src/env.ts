import {
  DatabaseConfig,
  type DatabaseConfigValues,
} from "@yellow-rpc/database";
import { type Config, ConfigProvider, Context, Layer } from "effect";

type EnvValues = DatabaseConfigValues;

const envConfig: Config.Config<EnvValues> = DatabaseConfig;

export class Env extends Context.Tag("Auth")<Env, EnvValues>() {}

export const EnvLive = Layer.merge(
  Layer.setConfigProvider(ConfigProvider.fromEnv()),
  Layer.effect(Env, envConfig),
);

export const EnvTest = Layer.merge(
  Layer.setConfigProvider(
    ConfigProvider.fromJson({
      host: "localhost",
      port: 6379,
    }),
  ),
  Layer.effect(Env, envConfig),
);
