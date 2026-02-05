import { Config, ConfigProvider, Context, Layer, type Redacted } from "effect";

type EnvValues = {
  readonly redisUrl: Redacted.Redacted<string>;
  readonly masterKey: Redacted.Redacted<string>;
  readonly adminPrivateKey: Redacted.Redacted<string>;
  readonly alchemyApiToken: Redacted.Redacted<string>;
  readonly clearNodeWsUrl: string;
  readonly adminAddress: string;
};

const envConfig: Config.Config<EnvValues> = Config.all({
  adminAddress: Config.string("ADMIN_ADDRESS"),
  adminPrivateKey: Config.redacted("ADMIN_PRIVATE_KEY"),
  alchemyApiToken: Config.redacted("ALCHEMY_API_TOKEN"),
  clearNodeWsUrl: Config.string("CLEARNODE_WS_URL"),
  masterKey: Config.redacted("MASTER_KEY"),
  redisUrl: Config.redacted("REDIS_URL"),
});

export class Env extends Context.Tag("Auth")<Env, EnvValues>() {}

export const EnvLive = Layer.merge(
  Layer.setConfigProvider(ConfigProvider.fromEnv()),
  Layer.effect(Env, envConfig),
);

export const EnvTest = Layer.merge(
  Layer.setConfigProvider(
    ConfigProvider.fromJson({
      redisUrl: "redis://localhost:6379",
    }),
  ),
  Layer.effect(Env, envConfig),
);
