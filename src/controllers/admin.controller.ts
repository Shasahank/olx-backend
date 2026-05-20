import { Request, Response } from "express";

export const adminDashboardController = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin",
    user: req.user,
  });
};
