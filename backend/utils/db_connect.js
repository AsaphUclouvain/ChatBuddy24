const redis = require('redis');
require("dotenv").config();

const createClient =  async () => {
    const client = redis.createClient({
        username: process.env.REDIS_USR,
        password: process.env.REDIS_SECRET,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    });

    client.on('error', (err) => {
        console.log(`Redis Error: ${err}`);
    });

    await client.connect();
    console.log("connected successfully to REDIS.")
    return client;
}

module.exports = createClient;