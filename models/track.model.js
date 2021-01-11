module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define('tbl_media', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        previewURL: {
            type: DataTypes.STRING,
            allowNull: false
        },
        album_id: {
            type: DataTypes.UUID
        }
    });
    
    Media.registerModels = (db) => {
        const {
            tbl_album
        } = db;
        Media.belongsTo(tbl_album, { foreignKey: 'album_id' });
    };
    
    Media.sync();
    return Media;
};