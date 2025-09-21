const request = require("supertest");
const app = require("../src/app");
const userModel = require("../src/models/user.model");
const bcrypt = require("bcrypt");
const connectDB = require("../src/db/db");
const mongoose = require("mongoose");

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
    const password = await bcrypt.hash("password123", 10);
    await userModel.create({
      fullName: { firstName: "John", lastName: "Doe" },
      email: "john.doe@example.com",
      password: password,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

 it("should login an existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john.doe@example.com", password: "password123" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "john.doe@example.com");
  });

  it("fail login with incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john.doe@example.com", password: "wrongpassword" });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });

  it("fail login with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "non.existent@example.com", password: "password123" });

    expect(res.statusCode).toEqual(400); // matches controller
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });
});
