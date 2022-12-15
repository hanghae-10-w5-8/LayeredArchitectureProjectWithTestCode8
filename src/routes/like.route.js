const express = require('express');
const router = express.Router();

const authUserMiddleware = require('../../src/middlewares/auth-user.middlesare');
const LikeController = require('../controllers/like.controller');
const likeController = new LikeController();

// 합쳐지면 index.js/router.use('/posts', [likeRouter, postRouter]); 로 수정
router.get('/like', authUserMiddleware, likeController.getAllLikedPosts);
router.put('/:postId/like', authUserMiddleware, likeController.createPostLike);

module.exports = router;
