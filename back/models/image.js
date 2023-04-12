module.exports = (sequelize, DataTypes) =>{
    const Image = sequelize.define('Image',{ //테이블명 Image
        src:{
            type: DataTypes.STRING(200), //길이제한 없는 텍스트
            allowNull: false,
        },
    },{
        // 한글 및 이모티콘 사용을 위한 설정
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    })
    // 모델간의 관계 설정
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post); // hasMany 의 반대로 대칭 1대 다 관계 성립
    };
    return Image;
};