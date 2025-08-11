const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const jwt = require('jsonwebtoken');
const connectDB = require('../utils/db_connect.js');
require('dotenv').config();

var cookieExtractorAccessToken = function(req) {
    var token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies['access_token'];
    }
    return token;
};

var cookieExtractorRefreshToken = function(req){
    try{
        const token = req.refreshToken ;
        delete req.refreshToken;
        return token;

    }catch(err){
        console.error(err);
        return null;
    }
    
}



const optsAccessToken = {
    jwtFromRequest : cookieExtractorAccessToken,
    secretOrKey:process.env.JWT_AC_SECRET
};

const optsRefreshToken = {
    jwtFromRequest : cookieExtractorRefreshToken,
    secretOrKey:process.env.JWT_RE_SECRET
};

passport.use('jwt-access', new JwtStrategy(optsAccessToken, async (jwt_payload, done)=>{
    done(null, jwt_payload);
}));

passport.use('jwt-refresh', new JwtStrategy(optsRefreshToken, async (jwt_payload, done)=>{
    try{
        const client = await connectDB();

        const refresh_token = jwt.sign({sub: jwt_payload.sub, role: process.env.SUPPORT_ROLE}, process.env.JWT_RE_SECRET);

        const val = await client.set(`refresh:${jwt_payload.sub}`, refresh_token);

        if(!val){
            throw new Error('error creating a new refresh token');
        }

        return done(null, {uuid:jwt_payload.sub});
    
    }catch(err){
        console.error(err);
        return done(err, false);
    }
}));

module.exports = passport;