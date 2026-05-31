import { AppError } from "../utils/app-error";
import { HTTP_STATUS } from "../constants/http-status";

import {
  findAccountByNumber,
  updateAccountBalance,
  findAccountByNumberTx,
  updateBalanceTx,
} from "../repositories/account.repository";

import {
  createTransaction,
  createTransactionTx,
} from "../repositories/transaction.repository";

import { pool } from "../db/mysql";

export const depositMoney = async (
  accountNumber: string,
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

export const withdrawMoney = async (
  accountNumber: string,
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

  if (currentBalance < amount) {
    throw new AppError("Insufficient balance", HTTP_STATUS.BAD_REQUEST);
  }

  const newBalance = currentBalance - amount;

  await updateAccountBalance(account.id, newBalance);

  await createTransaction(
    account.id,
    null,
    "WITHDRAW",
    amount,
    "Cash Withdrawal",
  );

  return {
    accountNumber: account.account_number,
    withdrawnAmount: amount,
    newBalance,
  };
};

export const transferMoney = async (
  fromAccountNumber: string,
  toAccountNumber: string,
  amount: number,
  userId: number,
) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const sender = await findAccountByNumberTx(connection, fromAccountNumber);

    if (!sender) {
      throw new AppError("Sender account not found", HTTP_STATUS.NOT_FOUND);
    }

    if (sender.user_id !== userId) {
      throw new AppError("Access denied", HTTP_STATUS.FORBIDDEN);
    }

    const receiver = await findAccountByNumberTx(connection, toAccountNumber);

    if (!receiver) {
      throw new AppError("Receiver account not found", HTTP_STATUS.NOT_FOUND);
    }

    if (sender.balance < amount) {
      throw new AppError("Insufficient balance", HTTP_STATUS.BAD_REQUEST);
    }

    const senderBalance = Number(sender.balance) - amount;
    const receiverBalance = Number(receiver.balance) + amount;

    await updateBalanceTx(connection, sender.id, senderBalance);

    await updateBalanceTx(connection, receiver.id, receiverBalance);

    await createTransactionTx(
      connection,
      sender.id,
      receiver.id,
      "TRANSFER",
      amount,
      "Funds Transfer"
    );

    await connection.commit();

    return {
      message: "Transfer successful",
    };
  } catch (error) {
    await connection.rollback();
    console.error("Transfer error:", error);
    throw error;
  } finally {
    connection.release();
  }
};
