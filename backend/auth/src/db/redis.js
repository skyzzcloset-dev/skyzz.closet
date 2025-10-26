const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});
redis.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redis;
