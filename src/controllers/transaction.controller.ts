import { Request, Response, NextFunction } from "express";

import {
  depositMoney as depositMoneyService,
  withdrawMoney,
} from "../services/transaction.service";

import { depositSchema, withdrawSchema } from "../validators/account.validator";

import { sendSuccessResponse } from "../utils/response";

import { HTTP_STATUS } from "../constants/http-status";

import { AppError } from "../utils/app-error";

export const deposit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accountNumber = Number(req.params.accountId);

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

export const withdraw = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accountNumber = Number(req.body.accountNumber);

    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const { amount } = withdrawSchema.parse(req.body);

    const result = await withdrawMoney(accountNumber, amount, userId);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Amount withdrawn successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
