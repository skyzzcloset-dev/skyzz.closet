const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");

// Mock Redis
jest.mock("../src/db/redis", () => ({
  set: jest.fn().mockResolvedValue(true),
}));

let mongoServer;
jest.setTimeout(60000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({ binary: { version: "7.0.3" } });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoServer) await mongoServer.stop();
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe("POST /api/auth/logout", () => {
  it("should clear the auth cookie and log out the user", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", "token=your_jwt_token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "User logged out successfully",
    });

    const cookies = res.headers["set-cookie"][0];
    expect(cookies).toMatch(/token=;/);
    expect(cookies).toMatch(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
  });
});
