import request from "supertest";

import app from "../app";

import pool from "../database/db";

describe("Item APIs", () => {
  const uniqueEmail = `item${Date.now()}@gmail.com`;

  const testUser = {
    name: "Item User",

    email: uniqueEmail,

    password: "123456",
  };

  let token = "";

  let itemId = 0;

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

  it("should create item", async () => {
    const response = await request(app)
      .post("/api/v1/items")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "iPhone 14",

        description: "Brand new iPhone",

        price: 65000,

        image_url: "https://example.com/image.jpg",
      });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);
  });

  it("should fetch all items", async () => {
    const response = await request(app)
      .get("/api/v1/items")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.items)).toBe(true);

    itemId = response.body.items[0].id;
  });

  it("should fetch single item", async () => {
    const response = await request(app).get(`/api/v1/items/${itemId}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should update item", async () => {
    const response = await request(app)
      .put(`/api/v1/items/${itemId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated iPhone",

        price: 70000,
      });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should not allow updating item status", async () => {
    const response = await request(app)
      .put(`/api/v1/items/${itemId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "sold",
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should delete item", async () => {
    const response = await request(app)
      .delete(`/api/v1/items/${itemId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  afterAll(async () => {
    await pool.end();
  });
});
