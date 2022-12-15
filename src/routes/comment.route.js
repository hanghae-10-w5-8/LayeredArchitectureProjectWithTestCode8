const express = require('express');
const router = express.Router();
const authUserMiddleware = require('../middlewares/auth.middleware.js');

const CommentController = require('../controllers/comment.controller.js');
const commentController = new CommentController();

router.post('/:postId',authUserMiddleware ,commentController.createdComment);
router.put('/:commentId',authUserMiddleware ,commentController.editComment);
router.delete('/:commentId',authUserMiddleware ,commentController.deleteComment);
router.get('/:postId',authUserMiddleware ,commentController.getComment);
module.exports = router;
