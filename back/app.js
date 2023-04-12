const express = require('express');
const db = require('./models');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportConfig = require('./passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const app = express();
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');


db.sequelize.sync({force: false}); // true 시작시 테이블 지웠다 다시 만들기
passportConfig();

app.use(morgan('dev'));

// 실무에서는 특정 프론트 포트까지 잡아줘야함(보안)
//app.use(cors('http://localhost:3000'));
//axios withCredentials 호환을 위하여 심었으나 
//nuxt.config.js 에서 proxy 설정을 잡아서 없어도 쿠키 생성 됨
app.use(cors({
    origin: 'http://localhost:3080',
    credentials: true,
}));
//req.body 만들어줌
app.use('/',express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookie('cookiesecret'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret',
    cookie:{
        httpOnly:true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req, res) => {
    console.log(req.isAuthenticated());
    res.send('안녕 백엔드^^');
});

app.use('/api/user',userRouter);
app.use('/api/post',postRouter);
app.use('/api/posts',postsRouter);

app.listen(3085,()=>{
    console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`);
});