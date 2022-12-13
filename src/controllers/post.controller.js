const PostService = require('../services/post.service.js');
const { InvalidParamsError } = require('../exceptions/index.exception.js');

class PostController {
    #postService;
    constructor() {
        this.#postService = new PostService();
    }
    createPost = async (req, res, next) => {
        try {
            console.log(req.body);
            const { userId, title, content } = req.body;

            if (!title || !content) {
                throw new InvalidParamsError();
            }

            const posts = await this.#postService.createPost({
                userId,
                title,
                content,
            });
            res.json({ result: posts });
        } catch (error) {
            next(error);
        }
    };

    getPosts = async (req, res, next) => {
        const post = await this.#postService.findAllPost();
        res.json({ result: post });
    };
    getPostById = async (req, res, next) => {
        try {
            const { postId } = req.params;
            if (!postId) throw new InvalidParamsError();
            const post = await this.#postService.findPostById(postId);

            res.json({ data: post });
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
            res.json({ result: '게시글 수정 완료' });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = PostController;
