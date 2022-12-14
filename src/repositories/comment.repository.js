const { Comments, Users } = require('../models');
const { Op } = require('sequelize');

class CommentRepository extends Comments {
    constructor() {
        super();
    }
    getComment = async ({ postId }) => {
        const comments = await Comments.findAll({
            raw: true,
            where: { postId: postId },
            include: [
                {
                    model: Users,
                    attributes: ['nickname'],
                },
            ],
        });
        return comments;
    };

    findComment = async ({ commentId, userId }) => {
        return Comments.findOne({
            where: {
                [Op.and]: [{ commentId }, { userId }],
            },
        });
    };

    createdComment = async ({ postId, userId, comment }) => {
        const comments = await Comments.create({
            postId: postId,
            userId: userId,
            content: comment,
        });

        return comments;
    };

    editComment = async ({ commentId, comment }) => {
        const result = await Comments.update(
            { content: comment },
            {
                where: { commentId: commentId },
            }
        );

        return result;
    };

    deleteComment = async ({ commentId, userId }) => {
        const result = await Comments.destroy({
            where: {
                [Op.and]: [{ commentId }, { userId }],
            },
        });

        return result;
    };
}

module.exports = CommentRepository;
