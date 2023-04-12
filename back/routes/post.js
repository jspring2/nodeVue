const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');

const { isLoggedIn } = require('./middlewares');

const router = express.Router();

const upload = multer({ //multer form 데이터 해석
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'uploads');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname); // 확장자 뽑아오기
            const basename = path.basename(file.originalname, ext); //제로초.png, basename = 제로초, ext = .png
            done(null, basename + Date.now() + ext);
        },
    }),
    limit: { fileSize : 20 * 1024 * 1024 }, // 20mb 파일사이즈 제한
});

//router 실행 전에는 passport 의 deserializeUser 가 실행된다.
router.post('/', isLoggedIn, async (req, res)=> {
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        if(hashtags) {
            //있으면 저장 x 없으면 저장
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() },
            })));
            await newPost.addHashtags(result.map(r => r[0]));
        }

        if (req.body.image) {
            if(Array.isArray(req.body.image)){
                //map이 들어있기 때문에 순차적으로 모두 처리 될 수 있도록 Promise.all 처리
                const images = await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image, PostId: newPost.id });
                }))
            } else {
                const image  = await db.Image.create({ src: req.body.image, PostId: newPost.id});
            }
        } else {
            console.log('이미지 파일 미존재');
        }

        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            },{
                model: db.Image,
            },{
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }],
        });
        return res.json(fullPost);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// single ( 파일 1개 )
// array ( 같은 키로 여러 개 ) , ex) image라는 키로 여러개
// fields ( 다른키로 여러개 )
// none ( 파일 업로드 X )
router.post('/images', isLoggedIn, upload.array('image'), (req, res)=> {
    //req.files = [{filename: '웃는얼굴20190826.png'},{filename: '메가폰20190826.png'}];
    console.log(req.files);
    res.json(req.files.map(v=>v.filename));
});

// 전체수정 put, 부분수정 patch
//router.patch()

router.delete('/:id',async (req, res, next) => {
    try {
        await db.Post.destroy({
            where:{
                id: req.params.id,
            }
        });
        res.send('삭제했습니다.');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:id/comments',isLoggedIn, async(req, res, netx)=>{
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const comments = await db.Comment.findAll({
            where : {
                PostId: req.params.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
                order: [['createdAt','ASC']], //2차원 배열로 해야함. > 두번째 조건이 있을 수 있음
            }]
        });

        return res.json(comments);
    } catch (err) {
        console.error(err);
        netx(err);
    }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,      
        });
        const comment = await db.Comment.findOne({
            where : {
                id: newComment.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });
        return res.json(comment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/:id/retweet', isLoggedIn, async (req, res, next)=>{
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id},
            include:[{
                model: db.Post,
                as: 'Retweet', //리트윗한 게시글이면 원본 게시글이 됨
            }],
        });
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        if(req.user_id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)){
            return res.status(403).send('자신의 글은 리트윗 할 수 없습니다.');
        }
        
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await db.Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            }
        });
        if(exPost) {
            return res.status(403).send('이미 리트윗했습니다.');
        }

        const retweet = await db.Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet',
        });

        const retweetWithPrevPost = await db.Post.findOne({
            where:{ id: retweet.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            },{
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            },{
                model: db.Post,
                as: 'Retweet',
                include: [{
                    modedl: db.User,
                    attributes: ['id', 'nickname'],
                },{
                    model: db.Image,
                }],
            }],
        });
        res.json(retweetWithPrevPost);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/:id/like', isLoggedIn, async(req,res,next)=>{
    try {
        const post = await db.Post.findOne({where: {id: req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.addLiker(req.user.id);
        res.json({userId: req.user.id});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id/like', isLoggedIn, async(req,res,next)=>{
    try {
        const post = await db.Post.findOne({where: {id: req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.removeLiker(req.user.id);
        res.json({userId: req.user.id});
    } catch (err) {
        console.error(err);
        next(err);
    }
});
module.exports = router;