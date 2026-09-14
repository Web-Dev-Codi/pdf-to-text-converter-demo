import cors from "cors";
import express, { type Express } from "express";
import errorHandler from "./middleware/errorHandler.ts";
import { pdfParseRouter } from "./routes/pdf-parse.routes.ts";

const app = express() as Express;

app.use(cors());
app.use(express.json());

app.use("/api/v1/pdf", pdfParseRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
