import request from "supertest";

import express, { Request, Response } from "express";

import jwt from "jsonwebtoken";

import { ZodError } from "zod";

import { env } from "../config/env";

import { authenticateUser } from "../middlewares/auth.middleware";

import { authorizeRoles } from "../middlewares/role.middleware";

import errorMiddleware from "../middlewares/error.middleware";

import notFoundMiddleware from "../middlewares/notFound.middleware";

import AppError from "../utils/appError";

const app = express();

app.use(express.json());

/*
|--------------------------------------------------------------------------
| TEST ROUTES
|--------------------------------------------------------------------------
*/

// PUBLIC ROUTE
app.get("/public", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
  });
});

// AUTH ROUTE
app.get("/protected", authenticateUser, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ADMIN ROUTE
app.get(
  "/admin",
  authenticateUser,
  authorizeRoles("admin"),
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
    });
  },
);

// APP ERROR ROUTE
app.get("/app-error", (req: Request, res: Response) => {
  throw new AppError("Custom app error", 400);
});

// NORMAL ERROR ROUTE
app.get("/normal-error", (req: Request, res: Response) => {
  throw new Error("Internal server error");
});

// ZOD ERROR ROUTE
app.get("/zod-error", (req: Request, res: Response) => {
  const zodError = new ZodError([
    {
      code: "custom",
      path: ["email"],
      message: "Validation failed",
    },
  ]);

  throw zodError;
});

// DATABASE ERROR ROUTE
app.get("/db-error", (req: Request, res: Response) => {
  const error: any = new Error("SQL Error");

  error.code = "ER_BAD_FIELD_ERROR";

  throw error;
});

// MIDDLEWARES
app.use(notFoundMiddleware);

app.use(errorMiddleware);

describe("Middleware Tests", () => {
  const userToken = jwt.sign(
    {
      id: 1,
      role: "user",
    },
    env.JWT_SECRET,
  );

  const adminToken = jwt.sign(
    {
      id: 2,
      role: "admin",
    },
    env.JWT_SECRET,
  );

  it("should access public route", async () => {
    const response = await request(app).get("/public");

    expect(response.status).toBe(200);
  });

  it("should deny protected route without token", async () => {
    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should access protected route with valid token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should deny admin route for normal user", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);

    expect(response.body.success).toBe(false);
  });

  it("should allow admin route for admin user", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should handle AppError properly", async () => {
    const response = await request(app).get("/app-error");

    expect(response.status).toBe(400);

    expect(response.body.message).toBe("Custom app error");
  });

  it("should handle normal server error", async () => {
    const response = await request(app).get("/normal-error");

    expect(response.status).toBe(500);

    expect(response.body.success).toBe(false);
  });

  it("should handle zod validation error", async () => {
    const response = await request(app).get("/zod-error");

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should return 404 for unknown routes", async () => {
    const response = await request(app).get("/unknown-route");

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);
  });
});
