import { Response } from "express";

export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
