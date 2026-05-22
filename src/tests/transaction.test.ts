import request from "supertest";

import app from "../app";

describe("Transaction APIs", () => {
  const sellerEmail = `seller${Date.now()}@gmail.com`;

  const buyerEmail = `buyer${Date.now()}@gmail.com`;

  const sellerUser = {
    name: "Seller User",

    email: sellerEmail,

    password: "123456",
  };

  const buyerUser = {
    name: "Buyer User",

    email: buyerEmail,

    password: "123456",
  };

  let sellerToken = "";

  let buyerToken = "";

  let itemId = 0;

  let transactionId = 0;

  beforeAll(async () => {
    // CREATE SELLER
    await request(app).post("/api/v1/auth/signup").send(sellerUser);

    // LOGIN SELLER
    const sellerLogin = await request(app).post("/api/v1/auth/login").send({
      email: sellerUser.email,

      password: sellerUser.password,
    });

    sellerToken = sellerLogin.body.token;

    // CREATE BUYER
    await request(app).post("/api/v1/auth/signup").send(buyerUser);

    // LOGIN BUYER
    const buyerLogin = await request(app).post("/api/v1/auth/login").send({
      email: buyerUser.email,

      password: buyerUser.password,
    });

    buyerToken = buyerLogin.body.token;

    // CREATE ITEM
    await request(app)
      .post("/api/v1/items")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        title: "MacBook Pro",

        description: "Brand new MacBook",

        price: 120000,

        image_url: "https://example.com/mac.jpg",
      });

    // FETCH ITEMS
    const items = await request(app)
      .get("/api/v1/items?page=1&limit=10")
      .set("Authorization", `Bearer ${sellerToken}`);

    itemId = items.body.items[0].id;
  });

  it("should purchase item", async () => {
    const response = await request(app)
      .post(`/api/v1/transactions/purchase/${itemId}`)
      .set("Authorization", `Bearer ${buyerToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should not allow purchasing sold item", async () => {
    const response = await request(app)
      .post(`/api/v1/transactions/purchase/${itemId}`)
      .set("Authorization", `Bearer ${buyerToken}`);

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should fetch paginated buyer purchases", async () => {
    const response = await request(app)
      .get("/api/v1/transactions/my-purchases?page=1&limit=10")
      .set("Authorization", `Bearer ${buyerToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.page).toBe(1);

    expect(response.body.limit).toBe(10);

    expect(response.body.totalItems).toBeDefined();

    expect(response.body.totalPages).toBeDefined();

    expect(Array.isArray(response.body.transactions)).toBe(true);

    transactionId = response.body.transactions[0].id;
  });

  it("should fetch paginated seller sales", async () => {
    const response = await request(app)
      .get("/api/v1/transactions/my-sales?page=1&limit=10")
      .set("Authorization", `Bearer ${sellerToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.page).toBe(1);

    expect(response.body.limit).toBe(10);

    expect(response.body.totalItems).toBeDefined();

    expect(response.body.totalPages).toBeDefined();
  });

  it("should fetch transaction details", async () => {
    const response = await request(app)
      .get(`/api/v1/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${buyerToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });
});
