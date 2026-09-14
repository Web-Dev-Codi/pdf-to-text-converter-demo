import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { logger } from "./config/logger.ts";
import errorHandler from "./middleware/errorHandler.ts";
import { pdfParseRouter } from "./routes/pdf-parse.routes.ts";

const app = express() as Express;

const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
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

app.use("/api/v1/pdf", pdfParseRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    logger.info("Server is running on http://localhost:3000");
  });
}

export default app;
