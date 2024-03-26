import type { Request, Response, NextFunction } from "express";
import { CustomError } from "@/error";

interface ErrorResponse {
  status: number;
  message: string;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = "Internal Server Error";

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  const errorResponse: ErrorResponse = {
    status: statusCode,
    message: message,
  };

  res.status(statusCode).json(errorResponse);
}

export default errorHandler;
