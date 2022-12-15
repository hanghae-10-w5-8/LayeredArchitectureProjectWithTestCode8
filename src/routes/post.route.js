const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller.js');
const postController = new PostController();
const authMiddleware = require('../middlewares/auth.middleware.js');

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.getPosts);
router.get('/:postId', postController.getPostById);
router.put('/:postId', authMiddleware, postController.updatePost);
router.delete('/:postId', authMiddleware, postController.deletePost);


module.exports = router;
