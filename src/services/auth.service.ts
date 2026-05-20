import bcrypt from "bcryptjs";
import { CreateUserInput } from "../interfaces/user.interface";
import { createUser, findUserByEmail } from "../repositories/auth.repository";

export const signupService = async (
  userData: CreateUserInput,
): Promise<void> => {
  const existingUsers: any = await findUserByEmail(userData.email);

  if (existingUsers.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  await createUser({
    ...userData,
    password: hashedPassword,
  });
};
