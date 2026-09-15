import pino from "pino";

/** Log level from `LOG_LEVEL` env var, defaulting to `info`. */
const logLevel = process.env.LOG_LEVEL ?? "info";

/**
 * Shared pino logger for the API: ISO-8601 timestamps, string level labels,
 * no base bindings, and standard error serializers (`err`/`error` keys).
 */
export const logger: pino.Logger = pino({
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  base: null,
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },
});
