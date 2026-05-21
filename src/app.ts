import express, { Application, Request, Response } from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";

import swaggerJsdoc from "swagger-jsdoc";

import authRoutes from "./routes/auth.routes";

import userRoutes from "./routes/user.routes";

import adminRoutes from "./routes/admin.routes";

import itemRoutes from "./routes/item.routes";

import transactionRoutes from "./routes/transaction.routes";

import errorMiddleware from "./middlewares/error.middleware";

import notFoundMiddleware from "./middlewares/notFound.middleware";

const app: Application = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "OLX Marketplace API",
      version: "1.0.0",
      description: "Production-ready OLX Marketplace Backend APIs",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "OLX Marketplace API Running",
  });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/items", itemRoutes);

app.use("/api/v1/transactions", transactionRoutes);

// 404 HANDLER
app.use(notFoundMiddleware);

// GLOBAL ERROR HANDLER
app.use(errorMiddleware);

export default app;
