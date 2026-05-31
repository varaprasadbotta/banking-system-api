import { AppError } from "../utils/app-error";
import { HTTP_STATUS } from "../constants/http-status";

import {
  findAccountByNumber,
  updateAccountBalance,
} from "../repositories/account.repository";

import { createTransaction } from "../repositories/transaction.repository";

export const depositMoney = async (
  accountNumber: number,
  amount: number,
  userId: number,
) => {
  const account = await findAccountByNumber(accountNumber);

  if (!account) {
    throw new AppError("Account not found", HTTP_STATUS.NOT_FOUND);
  }

  if (account.user_id !== userId) {
    throw new AppError("Access denied", HTTP_STATUS.FORBIDDEN);
  }

  const currentBalance = Number(account.balance);

  const newBalance = currentBalance + amount;

  await updateAccountBalance(account.id, newBalance);

  await createTransaction(null, account.id, "DEPOSIT", amount, "Cash Deposit");

  return {
    accountNumber: account.account_number,
    depositedAmount: amount,
    newBalance,
  };
};
