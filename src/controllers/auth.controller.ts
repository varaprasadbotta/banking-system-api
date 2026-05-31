import { NextFunction, Request, Response } from "express";

import { registerUser } from "../services/auth.service";

import { registerUserSchema } from "../validators/auth.validator";

import { loginUser } from "../services/auth.service";
import { loginUserSchema } from "../validators/auth.validator";
import { getProfile } from "../services/auth.service";
import { AppError } from "../utils/app-error";
import { HTTP_STATUS } from "../constants/http-status";
import { sendSuccessResponse } from "../utils/response";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

    next(error);
  }
};

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const userProfile = await getProfile(userId);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Profile fetched successfully",
      userProfile,
    );
  } catch (error) {
    next(error);
  }
};
