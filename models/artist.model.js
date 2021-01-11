module.exports = (sequelize, DataTypes) => {
    const Artist = sequelize.define('tbl_artist', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    
    Artist.sync();

    return Artist;
};