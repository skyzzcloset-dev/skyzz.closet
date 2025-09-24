const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const User = require("../src/models/user.model");

let mongoServer;
jest.setTimeout(60000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({ binary: { version: "7.0.3" } });
  const uri = mongoServer.getUri();
  process.env.JWT_SECRET = "test_jwt_secret";
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  if (mongoServer) await mongoServer.stop();
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    const password = await bcrypt.hash("password123", 10);
    await User.create({
      fullName: { firstName: "John", lastName: "Doe" },
      email: "john.doe@example.com",
      password,
      role:"customer",
    });
  });

  it("should login an existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john.doe@example.com", password: "password123" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "john.doe@example.com");
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john.doe@example.com", password: "wrongpassword" });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });

  it("should fail login with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "non.existent@example.com", password: "password123" });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });
});
