import type {
  ParseApiError,
  PdfApiErrorCode,
  PdfParseResult,
} from "@pdf-to-text-converter-demo/shared-types";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import multer from "multer";
import { logger } from "../config/logger.ts";
import {
  extractPdfText,
  MAX_UPLOAD_SIZE_BYTES,
  PdfValidationError,
} from "../services/pdf-service.ts";
import { validatePdfUpload } from "../utils/pdf-uploads.ts";

/** Multer instance buffering the single `file` field in memory. */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES, files: 1 },
});

/**
 * Request augmented by `parsePdf` with the parse result, so the later
 * `respond` handler can serialize it without re-reading the file.
 */
interface ParsedRequest extends Request {
  parsedResult?: PdfParseResult;
}

/**
 * Sends a JSON error response in the shared `{ error: { code, message } }`
 * envelope.
 *
 * @param res - Express response to write to.
 * @param status - HTTP status code for the error.
 * @param code - Machine-readable error code from the shared contract.
 * @param message - Human-readable error message.
 */
function sendError(
  res: Response,
  status: number,
  code: PdfApiErrorCode,
  message: string,
): void {
  const error: ParseApiError = { code, message };
  res.status(status).json({ error });
}

/**
 * Stage 1 — rejects the request when no file was attached or the file fails
 * upload validation (size/magic bytes). Chains to `parsePdf` on success.
 */
function parseRequest(req: Request, res: Response, next: NextFunction): void {
  const file = req.file;
  if (!file) {
    sendError(
      res,
      400,
      "invalid_request",
      "No file uploaded. Attach a PDF file in the 'file' field.",
    );
    return;
  }
  try {
    validatePdfUpload(file.buffer);
  } catch (error) {
    if (error instanceof PdfValidationError) {
      sendError(
        res,
        error.isSize ? 413 : 415,
        error.isSize ? "payload_too_large" : "unsupported_media_type",
        error.message,
      );
      return;
    }
    next(error);
    return;
  }
  next();
}

/**
 * Stage 2 — extracts text from the uploaded PDF, logs timing/metadata, and
 * stores the result on the request for `respond`. Maps parse failures to a
 * 422 with the shared error envelope.
 */
async function parsePdf(
  req: ParsedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const file = req.file;
  if (!file) {
    sendError(
      res,
      400,
      "invalid_request",
      "No file uploaded. Attach a PDF file in the 'file' field.",
    );
    return;
  }

  const startedAt = Date.now();
  try {
    const result = await extractPdfText(file.buffer);
    result.fileName = file.originalname;
    req.parsedResult = result;
    logger.info(
      {
        requestId: req.headers["x-request-id"] ?? crypto.randomUUID(),
        fileName: file.originalname,
        sizeBytes: file.size,
        totalPages: result.totalPages,
        durationMs: Date.now() - startedAt,
      },
      "pdf parsed",
    );
    next();
  } catch (error) {
    logger.error(
      {
        requestId: req.headers["x-request-id"] ?? crypto.randomUUID(),
        fileName: file.originalname,
        sizeBytes: file.size,
        durationMs: Date.now() - startedAt,
        error,
      },
      "pdf parse failed",
    );
    sendError(
      res,
      422,
      "pdf_parse_failed",
      "The PDF file could not be parsed. It may be corrupted or use unsupported features.",
    );
  }
}

/**
 * Stage 3 — writes the successful `{ data: PdfParseResult }` response using
 * the result staged by `parsePdf`.
 */
function respond(req: ParsedRequest, res: Response): void {
  if (!req.parsedResult) {
    sendError(res, 500, "unknown_error", "Internal Server Error");
    return;
  }
  const { fileName, totalPages, text, pages } = req.parsedResult;
  res.status(200).json({ data: { fileName, totalPages, text, pages } });
}

/** The full POST /parse middleware chain: upload → validate → parse → respond. */
export const parsePdfHandler: RequestHandler[] = [
  upload.single("file"),
  parseRequest,
  parsePdf,
  respond,
] as const;
