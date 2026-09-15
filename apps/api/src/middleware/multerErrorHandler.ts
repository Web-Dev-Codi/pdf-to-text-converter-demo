import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { MAX_UPLOAD_SIZE_BYTES } from "../services/pdf-service.ts";

/**
 * Translates multer-specific upload errors into API responses.
 *
 * Multer's `LIMIT_FILE_SIZE` (file larger than the configured limit) becomes
 * a 413 with the shared error envelope; any other multer error is forwarded
 * to the catch-all error handler.
 *
 * @param err - The error thrown by multer during upload processing.
 */
export function multerErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof MulterError && err.code === "LIMIT_FILE_SIZE") {
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
