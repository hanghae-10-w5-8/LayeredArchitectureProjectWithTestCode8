const CommentService = require('../services/comment.service.js');
const { InvalidParamsError } = require('../exceptions/index.exception');

class CommentController {
    constructor() {
        this.commentService = new CommentService();
    }
    createComment = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { userId, comment } = req.body;

            if (!postId || !userId || !comment) {
                throw new InvalidParamsError();
            }

            const dbData = await this.commentService.createComment({
                postId,
                userId,
                comment,
            });

            res.json({ result: dbData });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = CommentController;
