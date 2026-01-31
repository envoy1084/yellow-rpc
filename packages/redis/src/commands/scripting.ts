// Scripting commands enable server-side Lua script execution.

// EVAL - Executes a server-side Lua script.
// EVALSHA - Executes a server-side Lua script by SHA1 digest.
// EVALSHA_RO - Executes a read-only server-side Lua script by SHA1 digest.
// EVAL_RO - Executes a read-only server-side Lua script.
// FCALL - Invokes a function.
// FCALL_RO - Invokes a read-only function.
// FUNCTION DELETE - Deletes a library and its functions.
// FUNCTION DUMP - Dumps all libraries into a serialized binary payload.
// FUNCTION FLUSH - Deletes all libraries and functions.
// FUNCTION KILL - Terminates a function during execution.
// FUNCTION LIST - Returns information about all libraries.
// FUNCTION LOAD - Creates a library.
// FUNCTION RESTORE - Restores all libraries from a payload.
// FUNCTION STATS - Returns information about a function during execution.
// SCRIPT DEBUG - Sets the debug mode of server-side Lua scripts.
// SCRIPT EXISTS - Determines whether server-side Lua scripts exist in the script cache.
// SCRIPT FLUSH - Removes all server-side Lua scripts from the script cache.
// SCRIPT KILL - Terminates a server-side Lua script during execution.
// SCRIPT LOAD - Loads a server-side Lua script to the script cache.

import type { RedisClientType } from "redis";

import { type Effectify, effectify } from "../common";

export type RedisScriptingShape = {
  eval: Effectify<RedisClientType["eval"]>;
  evalSha: Effectify<RedisClientType["evalSha"]>;
  evalShaRo: Effectify<RedisClientType["evalShaRo"]>;
  evalRo: Effectify<RedisClientType["evalRo"]>;
  fcall: Effectify<RedisClientType["fCall"]>;
  fcallRo: Effectify<RedisClientType["fCallRo"]>;
  functionDelete: Effectify<RedisClientType["functionDelete"]>;
  functionDump: Effectify<RedisClientType["functionDump"]>;
  functionFlush: Effectify<RedisClientType["functionFlush"]>;
  functionKill: Effectify<RedisClientType["functionKill"]>;
  functionList: Effectify<RedisClientType["functionList"]>;
  functionLoad: Effectify<RedisClientType["functionLoad"]>;
  functionRestore: Effectify<RedisClientType["functionRestore"]>;
  functionStats: Effectify<RedisClientType["functionStats"]>;
  scriptDebug: Effectify<RedisClientType["scriptDebug"]>;
  scriptExists: Effectify<RedisClientType["scriptExists"]>;
  scriptFlush: Effectify<RedisClientType["scriptFlush"]>;
  scriptKill: Effectify<RedisClientType["scriptKill"]>;
  scriptLoad: Effectify<RedisClientType["scriptLoad"]>;
};

export const makeRedisScripting = (
  c: RedisClientType,
): RedisScriptingShape => ({
  eval: effectify(c.eval),
  evalRo: effectify(c.evalRo),
  evalSha: effectify(c.evalSha),
  evalShaRo: effectify(c.evalShaRo),
  fcall: effectify(c.fCall),
  fcallRo: effectify(c.fCallRo),
  functionDelete: effectify(c.functionDelete),
  functionDump: effectify(c.functionDump),
  functionFlush: effectify(c.functionFlush),
  functionKill: effectify(c.functionKill),
  functionList: effectify(c.functionList),
  functionLoad: effectify(c.functionLoad),
  functionRestore: effectify(c.functionRestore),
  functionStats: effectify(c.functionStats),
  scriptDebug: effectify(c.scriptDebug),
  scriptExists: effectify(c.scriptExists),
  scriptFlush: effectify(c.scriptFlush),
  scriptKill: effectify(c.scriptKill),
  scriptLoad: effectify(c.scriptLoad),
});
