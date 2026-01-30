import { Config } from "effect";

export type DatabaseConfigValues = {
  readonly host: string;
  readonly port: number;
};

export const DatabaseConfig = Config.all({
  host: Config.string("REDIS_HOST"),
  port: Config.number("REDIS_PORT"),
});
