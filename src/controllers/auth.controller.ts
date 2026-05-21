import { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";

import { loginSchema, signupSchema } from "../validations/auth.validation";

import { loginService, signupService } from "../services/auth.service";

import { generateToken } from "../utils/jwt";

import { MESSAGES } from "../constants/messages";

export const signupController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = signupSchema.parse(req.body);

    await signupService(validatedData);

    res.status(201).json({
      success: true,
      message: MESSAGES.USER_REGISTERED,
    });
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
      message: MESSAGES.LOGIN_SUCCESS,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  },
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: MESSAGES.LOGOUT_SUCCESS,
    });
  },
);
