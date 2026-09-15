/**
 * A single page of text extracted from a PDF document.
 */
export interface ParsedPage {
  /** 1-based page number within the source PDF. */
  pageNumber: number;
  /** Raw text content extracted from the page. Tab characters are preserved. */
  text: string;
}

/**
 * The full result of parsing a PDF document.
 *
 * This is the `data` payload the API returns on a successful parse and the
 * shape the web client renders.
 */
export interface PdfParseResult {
  /** Original file name as uploaded by the client. Empty until the controller stamps it. */
  fileName: string;
  /** Total number of pages in the PDF. */
  totalPages: number;
  /** Convenience concatenation of all page text (server-side only; may be omitted by clients). */
  text: string;
  /** Per-page text in document order. */
  pages: ParsedPage[];
}

/**
 * Machine-readable error codes the PDF parse API can return.
 * The web client switches on these to show user-facing messages.
 */
export type PdfApiErrorCode =
  | "invalid_request"
  | "payload_too_large"
  | "unsupported_media_type"
  | "pdf_parse_failed"
  | "rate_limit_exceeded"
  | "unknown_error";

/**
 * Error payload included in a non-successful API response.
 */
export interface ParseApiError {
  /** Stable, machine-readable error code. */
  code: PdfApiErrorCode;
  /** Human-readable message suitable for display. */
  message: string;
}

/**
 * Envelope for every JSON response from the PDF parse API:
 * either `data` (success) or `error` (failure), never both.
 */
export interface ParseApiResponse {
  /** Present on success (HTTP 200): the parsed document. */
  data?: PdfParseResult;
  /** Present on failure: describes what went wrong. */
  error?: ParseApiError;
}
