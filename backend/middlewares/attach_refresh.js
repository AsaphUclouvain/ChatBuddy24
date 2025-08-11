const connectDB = require('../utils/db_connect');

/**
 * This middleware add the refreshToken attribute to the req object to make it available for the cookieExtractorRefreshToken function in config/passport.js
*/
const attach_refresh = async (req, res, next)=>{
    try{
        const client = await connectDB();
        const uuid = req?.signedCookies['uuid'] ;
        if (!uuid)
            return res.status(422).send("Invalid request");

        const token = await client.get(`refresh:${uuid}`);
        
        if (!token)
            return res.status(422).send("Invalid request");

        req.refreshToken = token;

        next();
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = attach_refresh;