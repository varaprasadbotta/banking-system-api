import {
  createAccount,
  findAccountById,
  findAccountsByUserId,
  getUserAccounts,
} from "../repositories/account.repository";

import { CreateAccountPayload } from "../types/account.types";
import { AppError } from "../utils/app-error";
import { HTTP_STATUS } from "../constants/http-status";

export const createBankAccount = async (
  payload: CreateAccountPayload,
  userId: number,
) => {
  // 1. Fetch all existing accounts for this user
  const existingAccounts = await getUserAccounts(userId);

  // 2. Check if they already have an account of the requested type
  const hasAccountType = existingAccounts.some(
    (acc) => acc.account_type === payload.accountType,
  );

  // 3. Block creation if they try to make a second account of the same type
  if (hasAccountType) {
    throw new AppError(
      `You already have a ${payload.accountType.toLowerCase()} account.`,
      HTTP_STATUS.BAD_REQUEST,
    );
  }
  const accountNumber = `ACC${Date.now()}`;

  const accountId = await createAccount(accountNumber, payload, userId);

  return {
    accountId,
    accountNumber,
  };
};

export const getMyAccounts = async (userId: number) => {
  const accounts = await findAccountsByUserId(userId);

  return accounts.map((account) => ({
    id: account.id,
    accountNumber: account.account_number,
    accountType: account.account_type,
    balance: Number(account.balance),
  }));
};

export const getAccountDetails = async (accountId: number, userId: number) => {
  const account = await findAccountById(accountId);

  if (!account) {
    throw new AppError("Account not found", HTTP_STATUS.NOT_FOUND);
  }

  if (account.user_id !== userId) {
    throw new AppError("Access denied", HTTP_STATUS.FORBIDDEN);
  }

  return {
    id: account.id,
    accountNumber: account.account_number,
    accountType: account.account_type,
    balance: Number(account.balance),
  };
};
