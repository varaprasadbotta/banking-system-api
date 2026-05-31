import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import {
  deposit,
  transferController,
  withdraw,
} from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.post("/accounts/:accountId/deposit", authenticate, deposit);
transactionRouter.post("/transactions/withdraw", authenticate, withdraw);
transactionRouter.post("/transfer", authenticate, transferController);

export default transactionRouter;
