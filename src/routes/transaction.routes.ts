import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { deposit, withdraw } from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.post("/accounts/:accountId/deposit", authenticate, deposit);
transactionRouter.post("/transactions/withdraw", authenticate, withdraw);

export default transactionRouter;
