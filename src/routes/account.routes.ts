import { Router } from "express";

import { createAccount } from "../controllers/account.controller";

import { authenticate } from "../middleware/auth.middleware";

const accountRouter = Router();

accountRouter.post("/create-account", authenticate, createAccount);

export default accountRouter;
