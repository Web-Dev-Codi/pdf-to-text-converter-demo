import type { NextFunction, Request, RequestHandler, Response } from "express";
import multer from "multer";
import { logger } from "../config/logger.ts";
import {
  extractPdfText,
  MAX_UPLOAD_SIZE_BYTES,
  type PdfParseResult,
  PdfValidationError,
} from "../services/pdf-service.ts";
import { validatePdfUpload } from "../utils/pdf-uploads.ts";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES, files: 1 },
});

interface ParsedRequest extends Request {
  parsedResult?: PdfParseResult;
}

function parseRequest(req: Request, res: Response, next: NextFunction): void {
  const file = req.file;
  if (!file) {
    res.status(400).json({
      error: {
        code: "invalid_request",
        message: "No file uploaded. Attach a PDF file in the 'file' field.",
      },
    });
    return;
  }
  try {
    validatePdfUpload(file.buffer);
  } catch (error) {
    if (error instanceof PdfValidationError) {
      const isSize = error.message.includes("exceeds");
      res.status(isSize ? 413 : 415).json({
        error: {
          code: isSize ? "payload_too_large" : "unsupported_media_type",
          message: error.message,
        },
      });
      return;
    }
    next(error);
    return;
  }
  next();
}

async function parsePdf(
  req: ParsedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({
      error: {
        code: "invalid_request",
        message: "No file uploaded. Attach a PDF file in the 'file' field.",
      },
    });
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
    res.status(422).json({
      error: {
        code: "pdf_parse_failed",
        message:
          "The PDF file could not be parsed. It may be corrupted or use unsupported features.",
      },
    });
  }
}

function respond(req: ParsedRequest, res: Response): void {
  res.status(200).json({
    data: {
      fileName: req.parsedResult?.fileName,
      totalPages: req.parsedResult?.totalPages,
      pages: req.parsedResult?.pages,
    },
  });
}

export const parsePdfHandler: RequestHandler[] = [
  upload.single("file"),
  parseRequest,
  parsePdf,
  respond,
] as const;
