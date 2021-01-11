const Media = require('../schemas/media');
const LikesAction = require('../schemas/likesAction');

const { RequestInputError } = require('../shared/errors');

exports.saveLikedMedia = async (req, res) => {
    try {
        const response = await LikesAction.findAndCountAll({
            where: {
                user_id: req.body.user_id,
                track_id: req.body.track_id
            }
        });
        if(response.count > 0) {
            const deletedRecord = LikesAction.destroy({
                where: {
                    user_id: req.body.user_id,
                    track_id: req.body.track_id
                }
            });
            if(!deletedRecord) throw new RequestInputError('Failed to delete user favourite.');
            return res.status(200).json(deletedRecord);
        } else {
            const newLiked = LikesAction.create(req.body);
            if(!newLiked) throw new RequestInputError('Failed to add user favourite.');
            return res.status(201).json(newLiked);
        }
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.status(403).send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while saving user likes data.'+error });
    }
}

exports.getByUserID = async (req, res) => {
    try {
        let userLikes = await LikesAction.findAll({
            where: {
                user_id: req.params.user_id
            },
            include: [
                { model: Media, all: true, nested: true },
            ]
        });
        
        userLikes = userLikes.map((x) => {
            return {
                Track_id: x.tbl_track.id,
                Track_name: x.tbl_track.name,
                previewURL: x.tbl_track.previewURL,
                Album_id: x.tbl_track.tbl_album.id,
                Album_name: x.tbl_track.tbl_album.name,
                Artist_id: x.tbl_track.tbl_album.tbl_artist.id,
                Artist_name: x.tbl_track.tbl_album.tbl_artist.name,
            };
        });
        if(!userLikes) throw new RequestInputError('Failed to fetch user favourite.');
        return res.status(200).json(userLikes);
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.status(403).send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while fetching user likes data.'+error });
    }
}