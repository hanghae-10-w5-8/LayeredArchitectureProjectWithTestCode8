const { Op } = require("sequelize");
const { likes, Users, Posts } = require('../models');
class LikeRepository extends likes {
    constructor() {
        super();
    }

    getAllPostsLike = async ({ userId }) => {
        return await likes.findAll({
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

    createPostLike = async ({ postId, userId }) => {
        const x = await likes.findOne({
            where: {
                [Op.and]: [{ postId }, { userId }],
            },
        });
        console.log(x);
        return x;
    };

    createLike = async ({ postId, userId }) => {
        return likes.create({
            postId,
            userId
        });
    };

    deleteLike = async ({ postId, userId }) => {
        return likes.destroy({
            where: {
                [Op.and]: [{ postId }, { userId }],
            },
        });
    }
    
}

module.exports = LikeRepository;