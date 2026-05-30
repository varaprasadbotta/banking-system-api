import { Request, Response } from "express";

import { registerUser } from "../services/auth.service";

import { registerUserSchema } from "../validators/auth.validator";

import { loginUser } from "../services/auth.service";
import { loginUserSchema } from "../validators/auth.validator";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerUserSchema.parse(req.body);

    const userId = await registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginUserSchema.parse(req.body);

    const token = await loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
