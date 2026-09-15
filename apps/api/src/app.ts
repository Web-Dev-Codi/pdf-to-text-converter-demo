import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { logger } from "./config/logger.ts";
import errorHandler from "./middleware/errorHandler.ts";
import { pdfParseRouter } from "./routes/pdf-parse.routes.ts";

/** The configured Express application. */
const app = express() as Express;

/**
 * Origins allowed by CORS, from the `CORS_ORIGINS` env var (comma-separated).
 * Defaults to the Vite dev server origin.
 */
const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    /**
     * Allows requests with no origin (curl, same-origin) and any origin on
     * the allowlist; anything else is rejected.
     */
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

/** Mounts the PDF parsing endpoints under the v1 API prefix. */
app.use("/api/v1/pdf", pdfParseRouter);

app.use(errorHandler);

/** Starts the HTTP server on port 3000 unless running under tests. */
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    logger.info("Server is running on http://localhost:3000");
  });
}

export default app;
