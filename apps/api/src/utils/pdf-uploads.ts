import {
  MAX_UPLOAD_SIZE_BYTES,
  PdfValidationError,
} from "../services/pdf-service.ts";

const PDF_MAGIC = "%PDF-";

export function validatePdfUpload(buffer: Buffer): void {
  if (buffer.length === 0) {
    throw new PdfValidationError("Uploaded file is empty.");
  }
  if (buffer.length > MAX_UPLOAD_SIZE_BYTES) {
    throw new PdfValidationError(`Uploaded file exceeds 10MB limit.`);
  }
  const hasMagic =
    buffer.subarray(0, PDF_MAGIC.length).toString("ascii") === PDF_MAGIC;
  if (!hasMagic) {
    throw new PdfValidationError("Uploaded file is not a valid PDF document.");
  }
}
