const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const User = require("../src/models/user.model");

let mongoServer;
jest.setTimeout(60000); // 60s for slow downloads

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({ binary: { version: "7.0.3" } });
  const uri = mongoServer.getUri();

  process.env.JWT_SECRET = "test_jwt_secret";
  process.env.SALT_ROUNDS = "10";
  process.env.NODE_ENV = "test";

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

describe("POST /api/auth/register", () => {
  it(
    "should register a new user",
    async () => {
      const res = await request(app).post("/api/auth/register").send({
        fullName: { firstName: "John", lastName: "Doe" },
        email: "john.doe@example.com",
        password: "password123",
        role:"customer",
        address: [
          { street: "123 Main St", city: "Anytown", state: "CA", zip: "12345", country: "USA" },
        ],
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", "john.doe@example.com");
    },
    20000
  );

  it(
    "should not register a user with existing email",
    async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await new User({
        fullName: { firstName: "John", lastName: "Doe" },
        email: "john.doe@example.com",
        password: hashedPassword,
      }).save();

      const res = await request(app).post("/api/auth/register").send({
        fullName: { firstName: "Jane", lastName: "Doe" },
        email: "john.doe@example.com",
        password: "password123",
        role:"customer",
        address: [
          { street: "123 Main St", city: "Anytown", state: "CA", zip: "12345", country: "USA" },
        ],
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "User already exists");
      expect(res.body).toHaveProperty("success", false);
    },
    20000
  );
});
