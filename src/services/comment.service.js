const CommentRepository = require('../repositories/comment.repository.js');

class CommentService {
    #commentRepository;
    constructor() {
        this.#commentRepository = new CommentRepository();
    }

    createComment = async ({ postId, userId, comment }) => {
        console.log(postId, userId, comment);
        const commentData = await this.#commentRepository.createComment({
            postId,
            userId,
            comment,
        });

        return commentData;
    };
}

module.exports = CommentService;
