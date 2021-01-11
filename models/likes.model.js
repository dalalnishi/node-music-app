module.exports = (sequelize, DataTypes) => {
    const LikesAction = sequelize.define('tbl_likes', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID
        },
        track_id: {
            type: DataTypes.UUID
        }
    });
    
    LikesAction.registerModels = (db) => {
        const {
            tbl_user,
            tbl_media
        } = db;
        LikesAction.belongsTo(tbl_user, { foreignKey: 'user_id' });
        LikesAction.belongsTo(tbl_media, { foreignKey: 'track_id' });
    };
    
    LikesAction.sync();
    return LikesAction;
};