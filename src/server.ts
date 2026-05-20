import app from "./app";
import pool from "./database/db";
import { env } from "./config/env";

const PORT = env.PORT;

const startServer = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL Database Connected Successfully");

    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database Connection Failed");
    console.error(error);
  }
};

startServer();
