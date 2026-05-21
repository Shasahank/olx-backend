import { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";

import AppError from "../utils/appError";

import {
  loginSchema,
  signupSchema,
} from "../validations/auth.validation";

import {
  loginService,
  signupService,
} from "../services/auth.service";

import { generateToken } from "../utils/jwt";

export const signupController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = signupSchema.parse(req.body);

    await signupService(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = loginSchema.parse(req.body);

    const user = await loginService(
      validatedData.email,
      validatedData.password,
    );

    if (!user) {
      throw new AppError(
        "Invalid email or password",
        401
      );
    }

    const token = generateToken(
      user.id,
      user.role
    );

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
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
);