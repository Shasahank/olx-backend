import request from "supertest";

import app from "../app";

import pool from "../database/db";

describe("User APIs", () => {
  const uniqueEmail = `user${Date.now()}@gmail.com`;

  const testUser = {
    name: "Profile User",

    email: uniqueEmail,

    password: "123456",
  };

  let token = "";

  beforeAll(async () => {
    // SIGNUP
    await request(app).post("/api/v1/auth/signup").send(testUser);

    // LOGIN
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,

      password: testUser.password,
    });

    token = loginResponse.body.token;
  });

  it("should fetch user profile", async () => {
    const response = await request(app)
      .get("/api/v1/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should not allow unauthorized profile access", async () => {
    const response = await request(app).get("/api/v1/users/profile");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  afterAll(async () => {
    await pool.end();
  });
});
