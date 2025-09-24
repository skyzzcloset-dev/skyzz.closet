// __tests__/auth.getProfile.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const User = require("../src/models/user.model");
const jwt = require("jsonwebtoken");

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

describe("GET /api/auth/profile/:id", () => {
  it("should get the user profile", async () => {
    const password = await bcrypt.hash("password123", 10);
    const user = await User.create({
      fullName: { firstName: "John", lastName: "Doe" },
      email: "john.doe@example.com",
      password,
      role: "customer",
    });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET);

    const res = await request(app)
      .get(`/api/auth/profile/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("john.doe@example.com");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("should return 404 if user not found", async () => {
    const dummyUser = await User.create({ fullName: { firstName: "Dummy", lastName: "User" }, email: "dummy@test.com", password: "pass" });
    const token = jwt.sign({ id: dummyUser._id, email: dummyUser.email, role: dummyUser.role }, process.env.JWT_SECRET);

    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/auth/profile/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });
});
