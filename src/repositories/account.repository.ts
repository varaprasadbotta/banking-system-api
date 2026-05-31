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

export const findAccountById = async (
  accountId: number,
): Promise<Account | null> => {
  const [rows] = await pool.execute<(Account & RowDataPacket)[]>(
    `
        SELECT *
        FROM accounts
        WHERE id = ?
        LIMIT 1
        `,
    [accountId],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

export const updateAccountBalance = async (
  accountId: number,
  balance: number,
): Promise<void> => {
  await pool.execute(
    `
      UPDATE accounts
      SET balance = ?
      WHERE id = ?
      `,
    [balance, accountId],
  );
};

export const findAccountByNumber = async (
  accountNumber: number,
): Promise<Account | null> => {
  const [rows] = await pool.execute<(Account & RowDataPacket)[]>(
    `
        SELECT *
        FROM accounts
        WHERE account_number = ?
        LIMIT 1
        `,
    [accountNumber],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};
