export interface ParsedPage {
  pageNumber: number;
  text: string;
}

export interface PdfParseResult {
  fileName: string;
  totalPages: number;
  pages: ParsedPage[];
}

interface ParseApiError {
  code: string;
  message: string;
}

interface ParseApiResponse {
  data?: PdfParseResult;
  error?: ParseApiError;
}

const envApiUrl = import.meta.env.VITE_API_URL;
export const DEFAULT_API_URL = envApiUrl ?? "http://localhost:3000";

export class PdfApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "PdfApiError";
    this.code = code;
  }
}

export class PdfNetworkError extends Error {
  constructor() {
    super("Could not reach the server. Is the API running on localhost:3000?");
    this.name = "PdfNetworkError";
  }
}

interface ParsePdfOptions {
  apiUrl?: string;
  fetcher?: typeof fetch;
}

export async function parsePdfText(
  file: File,
  { apiUrl = DEFAULT_API_URL, fetcher = fetch }: ParsePdfOptions = {},
): Promise<PdfParseResult> {
  const body = new FormData();
  body.append("file", file);

  let response: Response;
  try {
    response = await fetcher(`${apiUrl}/api/v1/pdf/parse`, {
      method: "POST",
      body,
    });
  } catch {
    throw new PdfNetworkError();
  }

  const payload = (await response.json()) as ParseApiResponse;

  if (!response.ok || !payload.data) {
    throw new PdfApiError(
      payload.error?.code ?? "unknown_error",
      payload.error?.message ?? "Something went wrong.",
    );
  }

  return payload.data;
}

export function formatPages(pages: ParsedPage[], totalPages: number): string {
  return pages
    .map(
      (page) =>
        `── Page ${page.pageNumber} of ${totalPages} ──\n\n${page.text
          .replace(/\t/g, "    ")
          .trim()}`,
    )
    .join("\n\n");
}
