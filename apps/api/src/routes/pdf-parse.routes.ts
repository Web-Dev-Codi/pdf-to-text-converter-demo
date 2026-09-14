import type { Router as ExpressRouter, Request, Response } from "express";
import { Router } from "express";
import {multerErrorHandler }  from "../middleware/multerErrorHandler.ts";

export const pdfParseRouter: ExpressRouter = Router();

// pdfParseRouter.post("/parse");
pdfParseRouter.get("/parse", (_req: Request, res: Response) => {
  res.send("PDF Parse Endpoint");
});
pdfParseRouter.use(multerErrorHandler);
