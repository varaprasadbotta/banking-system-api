import { Request, Response, NextFunction } from "express";

import { depositMoney as depositMoneyService } from "../services/transaction.service";

import { depositSchema } from "../validators/account.validator";

import { sendSuccessResponse } from "../utils/response";

import { HTTP_STATUS } from "../constants/http-status";

import { AppError } from "../utils/app-error";

export const deposit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accountNumber = req.params.accountId;

    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const { amount } = depositSchema.parse(req.body);

    const result = await depositMoneyService(accountNumber, amount, userId);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Amount deposited successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
