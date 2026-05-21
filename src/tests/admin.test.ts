import request from "supertest";

import app from "../app";

import pool from "../database/db";

describe("Admin APIs", () => {
  const uniqueEmail = `admin${Date.now()}@gmail.com`;

  const adminUser = {
    name: "Admin User",

    email: uniqueEmail,

    password: "123456",
  };

  let adminToken = "";

  beforeAll(async () => {
    // CREATE USER
    await request(app).post("/api/v1/auth/signup").send(adminUser);

    // MANUALLY MAKE ADMIN
    await pool.query(
      `
        UPDATE users
        SET role = 'admin'
        WHERE email = ?
        `,
      [adminUser.email],
    );

    // LOGIN
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: adminUser.email,

      password: adminUser.password,
    });

    adminToken = loginResponse.body.token;
  });

  it("should fetch admin dashboard", async () => {
    const response = await request(app)
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should not allow unauthorized access", async () => {
    const response = await request(app).get("/api/v1/admin/dashboard");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  afterAll(async () => {
    await pool.end();
  });
});
