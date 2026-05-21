import { Request, Response, NextFunction } from "express";

import { MESSAGES } from "../constants/messages";

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({
    success: false,
    message: `${MESSAGES.ROUTE_NOT_FOUND} - ${req.originalUrl}`,
  });
};

export default notFoundMiddleware;
