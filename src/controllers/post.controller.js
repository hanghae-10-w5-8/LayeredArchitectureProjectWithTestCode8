const PostService = require('../services/post.service.js');
const { InvalidParamsError } = require('../exceptions/index.exception.js');

class PostController {
    #postService;
    constructor() {
        this.#postService = new PostService();
    }
    createPost = async (req, res, next) => {
        try {
            const { userId, title, content } = req.body;

            if (!title || !content) {
                throw new InvalidParamsError(
                    '요청한 데이터 형식이 올바르지 않습니다.'
                );
            }

            const posts = await this.#postService.createPost(
                userId,
                title,
                content
            );
            res.status(201).json({ result: posts });
        } catch (error) {
            next(error);
        }
    };

    getPosts = async (req, res, next) => {
        try {
            const post = await this.#postService.findAllPost();
            res.status(200).json({ result: post });
        } catch (error) {
            next(error);
        }
    };
    getPostById = async (req, res, next) => {
        try {
            const { postId } = req.params;
            if (postId === 'like') return next();
            if (!postId) throw new InvalidParamsError();
            const post = await this.#postService.findPostById(postId);

            res.status(200).json({ data: post });
        } catch (error) {
            next(error);
        }
    };

    updatePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { title, content } = req.body;
            if (!title || !content) {
                throw new InvalidParamsError();
            }

            await this.#postService.updatePost(postId, title, content);
            res.status(200).json({ result: '게시글을 수정 하였습니다.' });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = PostController;
