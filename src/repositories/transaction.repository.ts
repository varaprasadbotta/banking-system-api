import { ResultSetHeader } from "mysql2";

import { pool } from "../db/mysql";
import { Request, Response, NextFunction } from "express";

import { depositMoney } from "../services/transaction.service";

import { depositSchema } from "../validators/account.validator";

import { sendSuccessResponse } from "../utils/response";

import { HTTP_STATUS } from "../constants/http-status";

import { AppError } from "../utils/app-error";

export const createTransaction = async (
  fromAccountId: number | null,
  toAccountId: number | null,
  transactionType: "DEPOSIT" | "WITHDRAW" | "TRANSFER",
  amount: number,
  description: string,
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
        INSERT INTO transactions (
          from_account_id,
          to_account_id,
          transaction_type,
          amount,
          description
        )
        VALUES (?, ?, ?, ?, ?)
        `,
    [fromAccountId, toAccountId, transactionType, amount, description],
  );

  return result.insertId;
};

import { PoolConnection } from "mysql2/promise";

export const createTransactionTx = async (
  connection: PoolConnection,
  fromAccountId: number | null,
  toAccountId: number | null,
  type: string,
  amount: number,
  description: string,
) => {
  await connection.query(
    `
      INSERT INTO transactions
      (
        from_account_id,
        to_account_id,
        transaction_type,
        amount,
        description
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [fromAccountId, toAccountId, type, amount, description],
  );
};
