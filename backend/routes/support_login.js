const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { v4 : uuidv4 } = require('uuid');
const connectDB = require('../utils/db_connect');
const attach_refresh = require('../middlewares/attach_refresh');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res)=>{

    try{
        const pswd = req.body.password;
        
        if (pswd !== process.env.SUPPORT_PASS){ 
            return res.status(401).send("You are not authorized");
        }

        const uuid = uuidv4();
        const access_token = jwt.sign({sub: uuid, role: process.env.SUPPORT_ROLE}, process.env.JWT_AC_SECRET, {expiresIn:'15m'});

        const refresh_token = jwt.sign({sub: uuid, role: process.env.SUPPORT_ROLE}, process.env.JWT_RE_SECRET);

        console.log(refresh_token);

        const client = await connectDB();

        const val = await client.set(`refresh:${uuid}`, refresh_token);    

        if (!val)
            throw new Error('cannot connect to redis DB');

        res.cookie('access_token', access_token, {
            signed:true,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Lax",       
            path: "/",
            maxAge: 1000 * 60 * 15
        });

        res.cookie('uuid', uuid, {
            signed:true,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Lax",       
            path: "/",
        });

        res.status(200).send('successfully logged in');

    }catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }


});


/**
 * Refresh token route. It explains by itself :)
*/
router.post('/token', attach_refresh, passport.authenticate('jwt-refresh', {session: false}), (req, res)=>{
    if (!req.user) return res.status(401).send('You are not authorized');

    const access_token = jwt.sign({sub: req.user.uuid, role: process.env.SUPPORT_ROLE}, process.env.JWT_AC_SECRET, {expiresIn:'15m'});

    res.cookie('access_token', access_token, {
        signed:true,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "Lax",       
        path: "/",
        maxAge: 1000 * 60 * 15
    });

    res.status(200).send('Access cookie successfully refreshed');
});

module.exports = router;