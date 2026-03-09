const Redis = require("ioredis").default;

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => {
  console.log("Server is connected to redis");
});

redis.on("ready", () => {
  console.log("IORedis client ready");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

// Export the client directly and helper functions
module.exports = {
  redis,
  getRedisClient: () => redis,
  isRedisReady: () => redis.status === 'ready',
};
