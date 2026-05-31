import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env";

import { HTTP_STATUS } from "../constants/http-status";

import { AppError } from "../utils/app-error";

import { JwtPayload } from "../types/auth.types";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(
      new AppError("Authorization header missing", HTTP_STATUS.UNAUTHORIZED),
    );
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Token missing", HTTP_STATUS.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    next(new AppError("Invalid token", HTTP_STATUS.UNAUTHORIZED));
  }
};
