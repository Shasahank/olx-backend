import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import itemRoutes from "./routes/item.routes";

const app: Application = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Hashers Marketplace API Running",
  });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/items", itemRoutes);

export default app;
