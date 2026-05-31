import bcrypt from "bcrypt";

import { createUser, findUserByEmail } from "../repositories/user.repository";

import { LoginUserPayload, RegisterUserPayload } from "../types/auth.types";

import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AppError } from "../utils/app-error";
import { HTTP_STATUS } from "../constants/http-status";
import { findUserById } from "../repositories/user.repository";

export const registerUser = async (
  payload: RegisterUserPayload,
): Promise<number> => {
  const { name, email, password } = payload;

  // Step 1
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email already exists", HTTP_STATUS.CONFLICT);
  }

  // Step 2
  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 3
  const userId = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return userId;
};

export const loginUser = async (payload: LoginUserPayload): Promise<string> => {
  const { email, password } = payload;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return token;
};

export const getProfile = async (userId: number) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  };
};
