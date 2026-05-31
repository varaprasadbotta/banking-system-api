import { Request, Response, NextFunction } from "express";

import { createBankAccount, getMyAccounts } from "../services/account.service";

import { createAccountSchema } from "../validators/account.validator";

import { sendSuccessResponse } from "../utils/response";

import { HTTP_STATUS } from "../constants/http-status";

import { AppError } from "../utils/app-error";

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createAccountSchema.parse(req.body);

    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const account = await createBankAccount(validatedData, userId);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.CREATED,
      "Account created successfully",
      account,
    );
  } catch (error) {
    next(error);
  }
};

export const getAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const accounts = await getMyAccounts(userId);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Accounts fetched successfully",
      accounts,
    );
  } catch (error) {
    next(error);
  }
};
