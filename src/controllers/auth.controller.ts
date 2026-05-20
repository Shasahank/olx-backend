import { Request, Response } from "express";

import { loginSchema, signupSchema } from "../validations/auth.validation";

import { loginService, signupService } from "../services/auth.service";

import { generateToken } from "../utils/jwt";

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

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await loginService(
      validatedData.email,
      validatedData.password,
    );

    const token = generateToken(user.id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const logoutController = (req: Request, res: Response): void => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
