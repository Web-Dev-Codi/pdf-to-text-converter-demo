/**
 * Validates an uploaded PDF buffer before it reaches the parser.
 *
 * Performs three cheap checks: non-empty, within the 10 MB size limit, and
 * starts with the `%PDF-` magic bytes. Deeper structure errors are the
 * parser's job, not this guard's.
 *
 * @param buffer - Raw bytes of the uploaded file (from multer memory storage).
 * @throws {PdfValidationError} If the file is empty, exceeds the size limit,
 * or lacks the PDF magic bytes.
 */
import {
  MAX_UPLOAD_SIZE_BYTES,
  PdfValidationError,
} from "../services/pdf-service.ts";

/** Signature every real PDF file starts with. */
const PDF_MAGIC = "%PDF-";
export function validatePdfUpload(buffer: Buffer): void {
  if (buffer.length === 0) {
    throw new PdfValidationError("Uploaded file is empty.");
  }
  if (buffer.length > MAX_UPLOAD_SIZE_BYTES) {
    throw new PdfValidationError("Uploaded file exceeds 10MB limit.", true);
  }
  const hasMagic =
    buffer.subarray(0, PDF_MAGIC.length).toString("ascii") === PDF_MAGIC;
  if (!hasMagic) {
    throw new PdfValidationError("Uploaded file is not a valid PDF document.");
  }
}
