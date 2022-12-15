const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller.js');
const postController = new PostController();

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:postId', postController.getPostById);
router.put('/:postId', postController.updatePost);
router.delete('/:postId', postController.deletePost);

module.exports = router;
