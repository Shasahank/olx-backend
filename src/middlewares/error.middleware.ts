import { Request, Response, NextFunction } from "express";

import { ZodError } from "zod";

import AppError from "../utils/appError";

import { MESSAGES } from "../constants/messages";

const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: error.issues[0].message,
    });

    return;
  }

  if (error.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: MESSAGES.INVALID_TOKEN,
    });

    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: MESSAGES.TOKEN_EXPIRED,
    });

    return;
  }

  if (error.code) {
    res.status(500).json({
      success: false,
      message: MESSAGES.DATABASE_ERROR,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: MESSAGES.INTERNAL_SERVER_ERROR,
  });
};

export default errorMiddleware;
