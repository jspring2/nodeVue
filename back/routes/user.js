const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isLoggedIn, async(req, res, next) => {
    const user = req.user;
    console.log("#################test user : ",user);
    return res.json(user);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password,12);
        const exUser = await db.User.findOne({
            where:{
                email: req.body.email,
            },
        });

        console.log("exUser : ",exUser);
        if(exUser) { // 이미 가입 되있는 경우
            return res.status(403).json({
                errCode: 1,
                message: '이미 회원가입되어있습니다.',
            });
        }
        await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname,
        });
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error(err);
                return next(err);
            }

            if (info) {
                return res.status(401).send(info.reason);
            }

            return req.login(user, async (err) => {//세션 사용자 정보 저장
                if (err) {
                    console.error(err);
                    return next(err);
                }
                return res.json(user);
            });
        })(req, res, next);
    } catch (err) {
        console.log(err);
        return next(err);
    }
});

router.post('/login', isNotLoggedIn,async (req, res, next) => {
    // req.body.email;
    // req.body.paaword;

    // // email, password 검사
    // await db.User.findOne();
    // // user[user.id]={

    // // };
    // // 세션에 저장
    // user[cookie] = '유저정보';
    // //프론트 유저정보 내려주기

    passport.authenticate('local',(err, user, info)=>{
        if(err){
            console.error(err);
            return next(err);
        }

        if(info){
            return res.status(401).send(info.reason);
        }

        return req.login(user, async(err)=>{//세션 사용자 정보 저장
            if(err){
                console.error(err);
                return next(err);
            }
            return res.json(user);
        });
    })(req, res, next);
});

router.post('/logout', isLoggedIn,(req,res,next)=>{
    req.logout((err) => {
        if (err) {
            res.redirect("/");
        } else {
            return res.status(200).send("server ok: 로그아웃 완료");
        }
    });
});

module.exports = router;