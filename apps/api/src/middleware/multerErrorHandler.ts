import type { NextFunction, Request, Response } from "express";
import {
  MAX_UPLOAD_SIZE_BYTES
} from "../services/pdf-service.ts";


export function multerErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "LIMIT_FILE_SIZE"
  ) {
    res.status(413).json({
      error: {
        code: "payload_too_large",
        message: `Uploaded file exceeds ${MAX_UPLOAD_SIZE_BYTES} byte limit.`,
      },
    });
    return;
  }
  next(err);
}
