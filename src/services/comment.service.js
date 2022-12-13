const CommentRepository = require('../repositories/comment.repository.js');
const { ValidationError } = require('../exceptions/index.exception.js');

class CommentService {
    #commentRepository;
    constructor() {
        this.#commentRepository = new CommentRepository();
    }

    createComment = async ({ postId, userId, comment }) => {
        const commentData = await this.#commentRepository.createComment({
            postId,
            userId,
            comment,
        });
        return commentData;
    };

    editComment = async ({ commentId, userId, comment }) => {
        const result = await this.#commentRepository.findComment({
            commentId,
            userId,
        });

        if (!result) throw new ValidationError('존재하지 않는 댓글입니다.');

        const editComment = await this.#commentRepository.editComment({
            commentId,
            userId,
            comment,
        });
        if (!editComment) {
            throw new ValidationError('댓글 수정에 실패하였습니다.');
        }
    };

    deleteComment = async ({ commentId, userId }) => {
        const result = await this.#commentRepository.findComment({
            commentId,
            userId,
        });
        if (!result) throw new ValidationError('존재하지 않는 댓글입니다.');

        const deleteResult = await this.#commentRepository.deleteComment({
            commentId,
            userId,
        });

        if (!deleteResult) throw ValidationError('댓글 삭제에 실패하였습니다.');
    };

    getComments = async ({ postId }) => {
        const commentsResult = await this.#commentRepository.getComment({
            postId,
        });
        commentsResult.map((data) => {
            data['nickName'] = data['User.nickname'];
            delete data['User.nickname'];
        });

        return commentsResult;
    };
}

module.exports = CommentService;
