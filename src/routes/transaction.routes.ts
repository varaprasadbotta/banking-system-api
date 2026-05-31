import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { deposit } from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.post(
  "/accounts/:accountId/deposit",
  authenticate,
  deposit,
);

export default transactionRouter;
