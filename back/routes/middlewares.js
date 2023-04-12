exports.isLoggedIn = (req, res, next) =>{
    console.log("isLoggedIn : ",req.isAuthenticated());
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).send('로그인이 필요합니다.');
};

exports.isNotLoggedIn = (req, res, next) =>{
    console.log("isNotLoggedIn : ",req.isAuthenticated());
    if(!req.isAuthenticated()){
        return next();
    }
    return res.status(401).send('로그인한 사람은 이용할 수 없습니다.');
};