import { Request, Response, NextFunction } from "express";

import {
  depositMoney as depositMoneyService,
  transferMoney,
  withdrawMoney,
} from "../services/transaction.service";

import { depositSchema, withdrawSchema } from "../validators/account.validator";

import { sendSuccessResponse } from "../utils/response";

import { HTTP_STATUS } from "../constants/http-status";

import { AppError } from "../utils/app-error";
import { transferSchema } from "../validators/transaction.validator";

export const deposit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accountNumber = req.params.accountId as string;

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
    const accountNumber = req.body.accountNumber;

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

export const transferController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const validatedData = transferSchema.parse(req.body);

    const result = await transferMoney(
      validatedData.fromAccountNumber,
      validatedData.toAccountNumber,
      validatedData.amount,
      userId,
    );

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Transfer successful",
      result,
    );
  } catch (error) {
    next(error);
  }
};
