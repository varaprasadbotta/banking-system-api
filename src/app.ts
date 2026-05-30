import express, { Express } from "express";
import authRouter from "./routes/auth.routes";

const app: Express = express();

/**
 * Global Middleware
 */
app.use(express.json());

app.use("/api/v1/auth", authRouter);

/**
 * Health Check Route
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Banking System API is running",
  });
});

export default app;
