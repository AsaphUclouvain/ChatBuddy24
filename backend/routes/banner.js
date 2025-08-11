const express = require('express');
const connectDB = require('../utils/db_connect');
const { v4 : uuidv4 } = require('uuid');
const AccessTokenHandler = require('../middlewares/auth.js');
const router = express.Router();


/**
 * this route receive from an AI agent or the support a request containing in it body the ip adress of the user to ban
 * This route is secured to allow access only to the support
*/
router.post("/banner", AccessTokenHandler, async (req, res)=>{
    try{
        const ipToBan = req.body.ip;
        const id = uuidv4(); 
        const client = await connectDB();
        await client.set(`banned:${ipToBan}`, `${id}`);

        res.status(200).json({ sucess: true, banned_ip: ipToBan });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;