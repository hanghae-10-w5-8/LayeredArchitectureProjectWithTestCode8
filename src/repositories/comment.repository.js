const { Op } = require('sequelize');

class CommentRepository {
    constructor(Comments, Users) {
        this.Comments = Comments
        this.Users = Users
    }
    getComment = async ({ postId }) => {
        const comments = await this.Comments.findAll({
            raw: true,
            where: { postId: postId },
            include: [
                {
                    model: this.Users,
                    attributes: ['nickname'],
                },
            ],
        });
        return comments;
    };

    findComment = async ({ commentId, userId }) => {
        return this.Comments.findOne({
            where: {
                [Op.and]: [{ commentId }, { userId }],
            },
        });
    };

    createdComment = async ({ postId, userId, comment }) => {
        const comments = await this.Comments.create({
            postId: postId,
            userId: userId,
            content: comment,
        });

        return comments;
    };

    editComment = async ({ commentId, comment }) => {
        const result = await this.Comments.update(
            { content: comment },
            {
                where: { commentId: commentId },
            }
        );

        return result;
    };

    deleteComment = async ({ commentId, userId }) => {
        const result = await this.Comments.destroy({
            where: {
                [Op.and]: [{ commentId }, { userId }],
            },
        });

        return result;
    };
}

module.exports = CommentRepository;
