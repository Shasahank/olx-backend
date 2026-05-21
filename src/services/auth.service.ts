import bcrypt from "bcryptjs";

import { CreateUserInput } from "../interfaces/user.interface";

import { createUser, findUserByEmail } from "../repositories/auth.repository";

import AppError from "../utils/appError";

export const signupService = async (
  userData: CreateUserInput,
): Promise<void> => {
  const existingUsers: any = await findUserByEmail(userData.email);

  if (existingUsers.length > 0) {
    throw new AppError("User already exists with this email", 400);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  await createUser({
    ...userData,
    password: hashedPassword,
  });
};

export const loginService = async (
  email: string,
  password: string,
): Promise<any> => {
  const users: any = await findUserByEmail(email);

  if (users.length === 0) {
    throw new AppError("Invalid email or password", 401);
  }

  const user = users[0];

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("Invalid email or password", 401);
  }

  return user;
};
