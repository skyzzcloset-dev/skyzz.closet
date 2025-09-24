// __tests__/auth.updateProfile.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const {MongoMemoryServer} = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const User = require("../src/models/user.model");
const jwt = require("jsonwebtoken");

let mongoServer;
jest.setTimeout(60000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({binary: {version: "7.0.3"}});
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

describe("Patch /api/auth/updateprofile/:id", () => {
  it("should update user profile", async () => {
    const password = await bcrypt.hash("password123", 10);
    const user = await User.create({
      fullName: {firstName: "John", lastName: "Doe"},
      email: "john.doe@example.com",
      password,
      role: "customer",
    });

    const token = jwt.sign(
      {id: user._id, email: user.email, role: user.role},
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .patch(`/api/auth/updateprofile/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: {firstName: "Jane", lastName: "Smith"}, // nested object
        address: [
          {
            street: "456 New St",
            city: "Newcity",
            state: "NY",
            zip: "67890",
            country: "USA",
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.user.fullName.firstName).toBe("Jane");
    expect(res.body.user.fullName.lastName).toBe("Smith");
    expect(res.body.user.address[0].street).toBe("456 New St");
  });

  it("should return 404 if user not found", async () => {
    const dummyUser = await User.create({
      fullName: {firstName: "Dummy", lastName: "User"},
      email: "dummy@test.com",
      password: "pass",
    });
    const token = jwt.sign(
      {id: dummyUser._id, email: dummyUser.email, role: dummyUser.role},
      process.env.JWT_SECRET
    );

    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/auth/updateprofile/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({fullName: {firstName: "Jane", lastName: "Smith"}});

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });
});
