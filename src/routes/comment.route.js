const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/comment.controller.js');
const commentController = new CommentController();

router.post('/:postId', commentController.createComment);

module.exports = router;
