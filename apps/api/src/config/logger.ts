import pino from "pino";

const logLevel = process.env.LOG_LEVEL ?? "info";

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
