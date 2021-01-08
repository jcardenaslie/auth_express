const redis = require("redis")

const client = redis.createClient({
  port: 6379,
  host:  "127.0.0.1"
})

client.on('connect', () => console.log("Redis connected"));

client.on('ready', () => console.log("Redis ready to use"));

client.on('end', () => console.log("Redis disconnected"));

client.on('error', error => console.log("Redis connection error", error.message));

process.on('SIGINT', () => client.quit())

module.exports = client