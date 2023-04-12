const passport = require('passport');
const db = require('../models');
const local = require('./local');


module.exports = () => {
    passport.serializeUser((user, done)=>{
        return done(null, user.id); // done 첫번째 자리는 error
    });
    passport.deserializeUser(async(id,done)=>{
        try {
            const user = await db.User.findOne(
                {
                    where:{ id },
                    attributes: [ 'id', 'nickname' ],
                });
            // deserializeUser 가 실행되면 req.user 에 넣어줌
            // req.isAuthenticated() === true 로 만들어줌
            return done(null, user); 
        } catch (err) {
            console.error(err);
            return done(err);
        }
    });
    local();
};