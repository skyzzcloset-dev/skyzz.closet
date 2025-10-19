// __tests__/product.addProduct.test.js

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const Product = require("../src/models/product.model");

// Mock ImageKit service
jest.mock("../src/services/imagekit.service", () => {
  return async (base64, filename, folder) => ({
    url: `https://dummy.url/${filename}`,
    fileId: `dummy-file-id-${filename}`,
  });
});

let mongoServer;
let adminToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.JWT_SECRET = "test_jwt_secret";
  process.env.IMAGEKIT_PUBLIC_KEY = "dummy";
  process.env.IMAGEKIT_PRIVATE_KEY = "dummy";
  process.env.IMAGEKIT_URL_ENDPOINT = "https://dummy.url";
  await mongoose.connect(uri);

  // Generate admin token
  const dummyAdmin = {
    id: new mongoose.Types.ObjectId(),
    role: "admin",
    email: "admin@test.com",
  };
  adminToken = jwt.sign(dummyAdmin, process.env.JWT_SECRET);
});

afterEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  if (mongoServer) await mongoServer.stop();
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe("POST /api/product/add", () => {
  it("should add a product successfully", async () => {
    const productData = {
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 10,
      category: "Electronics",
      brand: "BrandX",
    };

    const res = await request(app)
      .post("/api/product/add")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", productData.name)
      .field("description", productData.description)
      .field("price", productData.price)
      .field("stock", productData.stock)
      .field("category", productData.category)
      .field("brand", productData.brand);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("product");
    expect(res.body.product.name).toBe("Test Product");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/product/add")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Incomplete Product");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
