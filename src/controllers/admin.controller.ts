import { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";

export const adminDashboardController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  },
);
