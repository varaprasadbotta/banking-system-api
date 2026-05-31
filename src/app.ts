import express, { Express } from "express";
import authRouter from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import accountRouter from "./routes/account.routes";
import transactionRouter from "./routes/transaction.routes";

const app: Express = express();

/**
 * Global Middleware
 */
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accounts", accountRouter);
app.use("/api/v1", transactionRouter);

/**
 * Health Check Route
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Banking System API is running",
  });
});

app.use(errorMiddleware);

export default app;
