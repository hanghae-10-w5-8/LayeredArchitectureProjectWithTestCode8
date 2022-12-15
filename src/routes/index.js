const express = require('express');
const router = express.Router();
const commentRouter = require('./comment.route.js');
const likeRouter = require('./like.route.js');
const postRouter = require('./post.route.js');
const usersRouter = require('./users.route.js');

// router.use('/likes', [likeRouter]);
router.use('/posts', [likeRouter, postRouter]);
router.use('/comments', [commentRouter]);
router.use('/users', [usersRouter]);

module.exports = router;
