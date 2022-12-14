const express = require('express');
const router = express.Router();

const LikeController = require('../controllers/like.controller');
const likeController = new LikeController();

// 합쳐지면 index.js/router.use('/posts', [likeRouter, postRouter]); 로 수정
router.get('/like', likeController.getAllLikedPosts);
router.put('/:postId/like', likeController.createPostLike);

module.exports = router;
