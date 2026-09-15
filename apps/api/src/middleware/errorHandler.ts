import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.ts";

/**
 * Catch-all error middleware: logs the stack and returns a generic 500.
 *
 * Anything that reached the end of a chain unhandled (or was passed to
 * `next(err)` by an earlier stage without its own response) lands here.
 *
 * @param err - The error that triggered the handler.
 */
function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error(err.stack ?? err.message);
  res.status(500).json({ error: "Internal Server Error" });
}

export default errorHandler;
