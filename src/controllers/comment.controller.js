const CommentService = require('../services/comment.service.js');
const { ValidationError } = require('../exceptions/index.exception');

class CommentController {
    #commentService;
    constructor() {
        this.#commentService = new CommentService();
    }
    createComment = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { userId, comment } = req.body;

            if (!postId || !userId || !comment) {
                throw new ValidationError('요청한 데이터 형식이 올바르지 않습니다.');
            }

            const dbData = await this.#commentService.createdComment({
                postId,
                userId,
                comment,
            });

            res.json({ result: dbData });
        } catch (error) {
            next(error);
        }
    };

    editComment = async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const { comment, userId } = req.body;

            if (!commentId || !userId || !comment) {
                throw new ValidationError('요청한 데이터 형식이 올바르지 않습니다.');
            }

            await this.#commentService.editComment({
                commentId,
                userId,
                comment,
            });

            res.json({ result: '댓글 수정을 완료하였습니다.' });
        } catch (error) {
            next(error);
        }
    };

    deleteComment = async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const { userId } = req.body;
            if (!userId) throw new ValidationError('요청한 데이터 형식이 올바르지 않습니다.');

            await this.#commentService.deleteComment({
                commentId,
                userId,
            });

            res.json({ result: '댓글 삭제를 완료하였습니다.' });
        } catch (error) {
            next(error);
        }
    };

    getComments = async (req, res, next) => {
        try {
            const { postId } = req.params;

            if (!postId) throw new ValidationError('요청한 데이터 형식이 올바르지 않습니다.');

            const result = await this.#commentService.getComments({
                postId,
            });

            res.json({ result: result });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = CommentController;
