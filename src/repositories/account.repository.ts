import { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../db/mysql";

import { CreateAccountPayload, Account } from "../types/account.types";

export const createAccount = async (
  accountNumber: string,
  payload: CreateAccountPayload,
  userId: number,
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
      INSERT INTO accounts (
        account_number,
        account_type,
        balance,
        user_id
      )
      VALUES (?, ?, ?, ?)
      `,
    [accountNumber, payload.accountType, 0, userId],
  );

  return result.insertId;
};

export const getUserAccounts = async (userId: number): Promise<Account[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM accounts WHERE user_id = ?`,
    [userId],
  );

  return rows as Account[];
};

export const findAccountsByUserId = async (
  userId: number,
): Promise<Account[]> => {
  const [rows] = await pool.execute<(Account & RowDataPacket)[]>(
    `
        SELECT *
        FROM accounts
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
    [userId],
  );

  return rows;
};
