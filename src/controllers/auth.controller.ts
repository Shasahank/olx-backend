import { Request, Response } from "express";
import { signupSchema } from "../validations/auth.validation";
import { signupService } from "../services/auth.service";

export const signupController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = signupSchema.parse(req.body);

    await signupService(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
