import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";
import { CreateUserPayload } from "../types/auth.types";

import { pool } from "../db/mysql";

import { User } from "../types/user.types";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
      SELECT *
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as User;
};

export const createUser = async (
  payload: CreateUserPayload,
): Promise<number> => {
  const { name, email, password } = payload;

  const [result] = await pool.execute<ResultSetHeader>(
    `
      INSERT INTO users (
        name,
        email,
        password
      )
      VALUES (?, ?, ?)
    `,
    [name, email, password],
  );

  return result.insertId;
};
