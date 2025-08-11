const connectDB = require('../utils/db_connect');
const rateLimit = require('express-rate-limit');
const { v4 : uuidv4 } = require('uuid');


/**
 * THis middleware check all the ip address at the hanshake before any communication
*/
const checkBlacklisted = async (socket, next)=>{
    try{
        const client = await connectDB();
        
        const ipCloudfare = socket.handshake.headers["cf-connecting-ip"];

        const forwaded = socket.handshake.headers["x-forwarded-for"];

        const ipAddr = ipCloudfare || (forwaded ? forwaded.split(",")[0].trim() : socket.handshake.address);

        if (!ipAddr){
            return next();
        }

        const ip = await client.get(`banned:${ipAddr}`) || await client.get(`tmp_banned:${ipAddr}`);

        if (ip){
            return next(new Error("IP is banned"));
        }

        next();

    }catch(err){
        console.error(err);
    }

}

/**
 * Protect aigainst DDos attack and server crashing, using ip banning temporary
*/
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,// 15 minutes
    limit:100,//Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', //draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers. So the attacker won't know the rate limit.
    handler: async (req, res)=>{    
        try{
            const client = await connectDB();
            const ip = req.ip; //will be set using req.headers["cf-connecting-ip"] once behind the cloudfare proxy
            const id = uuidv4();

            await client.set(`tmp_banned:${req.ip}`, id, 'EX',3600); //client banned for 1hour

            res.status(429).json({ success: true, banned_ip: ip });

        }catch(err){
            console.error(err);
            res.status(500).send({error: "Internal Server Error"});
        }
    }
});



module.exports = {checkBlacklisted, limiter};
