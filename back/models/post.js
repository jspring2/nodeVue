module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post',{ //테이블명 posts
        content:{
            type: DataTypes.TEXT, //길이제한 없는 텍스트
            allowNull: false,
        },
    },{
        // 한글 및 이모티콘 사용을 위한 설정
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    })
    // 모델간의 관계 설정
    Post.associate = (db) => {
        db.Post.belongsTo(db.User); // hasMany 의 반대로 대칭 1대 다 관계 성립
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsToMany(db.User, {through:'Like', as:'Likers'});
        db.Post.belongsTo(db.Post,{as:'Retweet'}); //RetweetId
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'})
    };
    return Post;
};