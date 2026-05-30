import bcrypt from "bcrypt";

import { createUser, findUserByEmail } from "../repositories/user.repository";

import { LoginUserPayload, RegisterUserPayload } from "../types/auth.types";

import jwt from "jsonwebtoken";

import { env } from "../config/env";

export const registerUser = async (
  payload: RegisterUserPayload,
): Promise<number> => {
  const { name, email, password } = payload;

  // Step 1
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
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
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
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
