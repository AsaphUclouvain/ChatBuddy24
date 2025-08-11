const passport = require('passport');

const AccessTokenHandler = (req, res, next)=>{
    passport.authenticate('jwt-access', {session: false}, (err, user, info)=>{
        if (err) return res.status(500).json({ error: "Internal Server Error" });

        if (!user) return res.status(401).json({ error: 'Invalid or expired token' });

        req.user = user;
        next();
    })(req, res, next);
}


module.exports = AccessTokenHandler;