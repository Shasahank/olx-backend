import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT || "3306",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "",

  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
};

// CREATE TABLE users (
//     id INT PRIMARY KEY AUTO_INCREMENT,

//     name VARCHAR(100) NOT NULL,

//     email VARCHAR(255) NOT NULL UNIQUE,

//     password VARCHAR(255) NOT NULL,

//     role ENUM('admin', 'user') DEFAULT 'user',

//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     ON UPDATE CURRENT_TIMESTAMP
// );
