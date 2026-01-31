import { Config, ConfigProvider, Context, Layer, type Redacted } from "effect";

type EnvValues = {
  readonly redisUrl: Redacted.Redacted<string>;
};

const envConfig: Config.Config<EnvValues> = Config.all({
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
