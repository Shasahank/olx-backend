import { Request, Response } from "express";

export const getProfileController = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
};
