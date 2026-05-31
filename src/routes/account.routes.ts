import { Router } from "express";

import { createAccount, getAccounts } from "../controllers/account.controller";

import { authenticate } from "../middleware/auth.middleware";

const accountRouter = Router();

accountRouter.post("/create-account", authenticate, createAccount);
accountRouter.get("/my-accounts", authenticate, getAccounts);

export default accountRouter;
