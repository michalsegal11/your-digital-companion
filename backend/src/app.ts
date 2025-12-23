import express from "express";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import healthRouter from "./routes/health.routes";

export const app = express();

app.use(express.json());
app.use(logger);

app.use("/health", healthRouter);

app.use(errorHandler);
