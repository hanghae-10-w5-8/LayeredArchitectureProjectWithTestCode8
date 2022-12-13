const PostRepository = require('../repositories/post.repository.js');
const { ValidationError } = require('../exceptions/index.exception.js');

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

    updatePost = async (postId, title, content) => {
        const result = await this.#postRepository.findPostById(postId);
        if (!result) throw new ValidationError('존재하지 않는 게시글입니다.');

        const updatePost = await this.#postRepository.updatePost(
            postId,
            title,
            content
        );
        if (!updatePost)
            throw new ValidationError('게시글 수정에 실패하였습니다.');
    };
}

module.exports = PostService;
