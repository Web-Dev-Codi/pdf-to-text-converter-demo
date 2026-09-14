import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.ts";

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
