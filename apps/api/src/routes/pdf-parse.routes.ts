import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { parsePdfHandler } from "../controllers/pdf-parse.controller.ts";
import { multerErrorHandler } from "../middleware/multerErrorHandler.ts";

const parseLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "rate_limit_exceeded",
      message: "Too many parse requests. Try again in a minute.",
    },
  },
});

export const pdfParseRouter: ExpressRouter = Router();

pdfParseRouter.post("/parse", parseLimiter, ...parsePdfHandler);
pdfParseRouter.use(multerErrorHandler);
