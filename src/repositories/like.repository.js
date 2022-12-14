const { Op } = require("sequelize");
const { likes, Users, Posts } = require('../models');
class LikeRepository {
    constructor(LikeModel) {
        this.likeModel = LikeModel;
    }

    getAllLikedPosts = async ( userId ) => {
        return await this.likeModel.findAll({
            where: { userId },
            include: [
                {
                    model: Posts,
                    attributes: { exclude: ['content', 'postId'] },
                    include: [
                        { model: likes, as: 'likes', attributes: ['likeId'] },
                        { model: Users, attributes: ['nickname'] },
                    ],
                },
            ],
        });
    };

    createPostLike = async ( postId, userId ) => {
        return this.likeModel.findOne({
            where: {
                [Op.and]: [{ postId }, { userId }],
            },
        });
    };

    createLike = async ( postId, userId ) => {
        return this.likeModel.create({
            postId,
            userId
        });
    };

    deleteLike = async ( postId, userId ) => {
        return this.likeModel.destroy({
            where: {
                [Op.and]: [{ postId }, { userId }],
            },
        });
    }
    
}

module.exports = LikeRepository;