const redis = require("redis")
const colors = require('colors');

const { REDIS_HOST, REDIS_PORT} = process.env


// TODO: make async

const client = redis.createClient({
  port: REDIS_PORT,
  host:  REDIS_HOST
})

client.on('connect', () => console.log("Redis connected".yellow));

client.on('ready', () => console.log("Redis ready to use".green));

client.on('end', () => console.log("Redis disconnected".red));

client.on('error', error => console.log("Redis connection error".red, error.message));

process.on('SIGINT', () => client.quit())

module.exports = client