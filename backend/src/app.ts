import express from "express";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import healthRouter from "./routes/health.routes";
import clientRouter from "./routes/client.routes";
import wigPurchaseRouter from "./routes/wigPurchase.routes";
import appointmentRouter from "./routes/appointment.routes";
import serviceVisitRouter from "./routes/serviceVisit.routes";
import transactionRouter from "./routes/transaction.routes";

export const app = express();

app.use(express.json());
app.use(logger);

app.use("/health", healthRouter);
app.use("/clients", clientRouter);
app.use("/wig-purchases", wigPurchaseRouter);
app.use("/appointments", appointmentRouter);
app.use("/service-visits", serviceVisitRouter);
app.use("/transactions", transactionRouter);


app.use(errorHandler);
