const CommentRepository = require('../repositories/comment.repository.js');
const { ValidationError } = require('../exceptions/index.exception.js');

class CommentService {
    #commentRepository;
    constructor() {
        this.#commentRepository = new CommentRepository();
    }

    createdComment = async ({ postId, userId, comment }) => {
        const commentData = await this.#commentRepository.createdComment({
            postId,
            userId,
            comment,
        });
        if(!commentData) throw ValidationError("댓글 작성에 실패하였습니다.",400)
        return commentData;
    };

    editComment = async ({ commentId, userId, comment }) => {
        const result = await this.#commentRepository.findComment({
            commentId,
            userId,
        });

        if (!result) throw new ValidationError('댓글이 존재하지 않습니다.',404);

        const editComment = await this.#commentRepository.editComment({
            commentId,
            userId,
            comment,
        });
        if (!editComment) {
            throw new ValidationError('댓글 수정이 정상적으로 처리되지 않았습니다.',400);
        }
    };

    deleteComment = async ({ commentId, userId }) => {
        const result = await this.#commentRepository.findComment({
            commentId,
            userId,
        });
        if (!result) throw new ValidationError('댓글이 존재하지 않습니다.',404);

        const deleteResult = await this.#commentRepository.deleteComment({
            commentId,
            userId,
        });

        if (!deleteResult) throw ValidationError('댓글 삭제가 정상적으로 처리되지 않았습니다.',400);
    };

    getComments = async ({ postId }) => {
        const commentsResult = await this.#commentRepository.getComment({
            postId,
        });
        if(!commentsResult) throw ValidationError("댓글 조회에 실패하였습니다.",400);
        commentsResult.map((data) => {
            data['nickName'] = data['User.nickname'];
            delete data['User.nickname'];
        });

        return commentsResult;
    };
}

module.exports = CommentService;
