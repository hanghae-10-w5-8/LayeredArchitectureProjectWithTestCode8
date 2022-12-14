const express = require('express');
const router = express.Router();

const LikeController = require('../controllers/like.controller');
const likeController = new LikeController();

router.get('/', likeController.getAllPostLike);
router.put('/:postId', likeController.createPostLike);

module.exports = router;
