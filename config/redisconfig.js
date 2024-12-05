const Redis = require("ioredis");
const connection = new Redis(process.env.MESSAGE_QUEUE_SERVER, {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("Connected to Redis!");
});

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = connection;
