const request = require("supertest");
const app = require("../src/app");

const connectDB = require("../src/db/db");
const mongoose = require("mongoose");

describe("POST /api/auth/logout", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  it("clears the auth cookie", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", "token=your_jwt_token");

    expect(res.status).toBe(200);

    const cookies = res.headers["set-cookie"][0];
    expect(cookies).toMatch(/token=;/);
    expect(cookies).toMatch(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/); // updated
  });

  it("should log out the user", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", "token=your_jwt_token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "User logged out successfully",
    });
  });
});
