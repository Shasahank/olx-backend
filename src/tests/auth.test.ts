import request from "supertest";

import app from "../app";

import pool from "../database/db";

describe("Auth APIs", () => {
  const uniqueEmail = `test${Date.now()}@gmail.com`;

  const testUser = {
    name: "Test User",

    email: uniqueEmail,

    password: "123456",
  };

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(testUser);

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);
  });

  it("should not allow duplicate email signup", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(testUser);

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should login successfully", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,

      password: testUser.password,
    });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.token).toBeDefined();
  });

  it("should fail with invalid credentials", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,

      password: "wrongpassword",
    });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  afterAll(async () => {
    await pool.end();
  });
});
