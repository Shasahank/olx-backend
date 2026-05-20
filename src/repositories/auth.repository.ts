import pool from "../database/db";
import { CreateUserInput } from "../interfaces/user.interface";

export const findUserByEmail = async (email: string): Promise<any> => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  return rows;
};

export const createUser = async (userData: CreateUserInput): Promise<any> => {
  const { name, email, password } = userData;

  const [result] = await pool.query(
    `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `,
    [name, email, password],
  );

  return result;
};
