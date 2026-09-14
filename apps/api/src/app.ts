import cors from "cors";
import express, { type Express } from "express";


const app = express() as Express;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
