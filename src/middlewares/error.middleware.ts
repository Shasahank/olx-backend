import { Request, Response, NextFunction } from "express";

import { ZodError } from "zod";

import AppError from "../utils/appError";

const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  // CUSTOM APP ERROR
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  // ZOD VALIDATION ERROR
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: error.issues[0].message,
    });

    return;
  }

  // JWT ERRORS
  if (error.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });

    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expired",
    });

    return;
  }

  // MYSQL ERRORS
  if (error.code) {
    res.status(500).json({
      success: false,
      message: "Database operation failed",
    });

    return;
  }

  // UNKNOWN ERRORS
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;
