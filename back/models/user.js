module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email:{
            type: DataTypes.STRING(40),
            allowNull: false, // 필수
            unique: true, //중복금지
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci', // 한글 사용을 위한 셋팅
    });
    // 모델간의 관계 설정
    User.associate = (db) => {
        db.User.hasMany(db.Post); //사용자 1 : 게시글 n 관계 = 일대다 관계
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post,{through:'Like', as:'Liked'});
        db.User.belongsToMany(db.User,{through:'Follow', as:'Followers',foreignKey: 'followingId'});
        db.User.belongsToMany(db.User,{through:'Follow', as:'Followings', foreignKey: 'followerId'});
    };
    return User;
};