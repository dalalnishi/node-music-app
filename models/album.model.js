module.exports = (sequelize, DataTypes) => {
    const Album = sequelize.define('tbl_album', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        artist_id: {
            type: DataTypes.UUID,
        }
    });
    
    Album.registerModels = (db) => {
        const {
            tbl_artist
        } = db;
        Album.belongsTo(tbl_artist, { foreignKey: 'artist_id' });
    };
    
    Album.sync();
    return Album;
};