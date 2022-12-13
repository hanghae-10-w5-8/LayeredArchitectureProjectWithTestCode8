const { Comments, Users, Posts } = require('../models');
const InternalServerError = require('../exceptions/index.exception.js');

class CommentRepository extends Comments {
    constructor() {
        super();
    }
    getComment = async ({ postId }) => {
        const comments = await Comments.findAll({
            where: { postId: postId },
        });
        return comments;
    };

    createComment = async ({ postId, userId, comment }) => {
        console.log(postId, userId, comment);
        const comments = await Comments.create({
            postId: postId,
            userId: userId,
            content: comment,
        });

        return comments;
    };
}

module.exports = CommentRepository;
