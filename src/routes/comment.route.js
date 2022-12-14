const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/comment.controller.js');
const commentController = new CommentController();

router.post('/:postId', commentController.createComment);
router.put('/:commentId', commentController.editComment);
router.delete('/:commentId', commentController.deleteComment);
router.get('/:postId', commentController.getComments);
module.exports = router;
