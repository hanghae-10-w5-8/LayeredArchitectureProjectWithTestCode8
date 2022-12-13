const PostRepository = require('../repositories/post.repository.js');

class PostService {
    #postRepository;
    constructor() {
        this.#postRepository = new PostRepository();
    }

    createPost = async ({ userId, title, content }) => {
        console.log(userId, title, content);
        const data = await this.#postRepository.createPost({
            userId,
            title,
            content,
        });
        return data;
    };

    findAllPost = async () => {
        const allPost = await this.#postRepository.findAllPost();
        allPost.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        return allPost.map((post) => {
            return {
                userId: post.userId,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });
    };

    findPostById = async (postId) => {
        const findPost = await this.#postRepository.findPostById(postId);

        return findPost;
    };
}

module.exports = PostService;
