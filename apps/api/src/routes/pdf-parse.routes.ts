import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { parsePdfHandler } from "../controllers/pdf-parse.controller.ts";
import { multerErrorHandler } from "../middleware/multerErrorHandler.ts";

/**
 * Rate limiter for the parse endpoint: 10 requests per client per 60 s.
 * Emits standard draft-8 rate-limit headers and responds with the shared
 * error envelope when the limit is hit.
 */
const parseLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  /** Lets tests make unlimited parse requests against the real limiter code. */
  skip: () => process.env.NODE_ENV === "test",
  message: {
    error: {
      code: "rate_limit_exceeded",
      message: "Too many parse requests. Try again in a minute.",
    },
  },
});

/** Router for all PDF parsing endpoints, mounted at `/api/v1/pdf`. */
export const pdfParseRouter: ExpressRouter = Router();

pdfParseRouter.post("/parse", parseLimiter, ...parsePdfHandler);
pdfParseRouter.use(multerErrorHandler);
