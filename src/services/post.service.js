const PostRepository = require('../repositories/post.repository.js');
const { ValidationError } = require('../exceptions/index.exception.js');
const { Users, Posts, Comments, likes } = require('../models');

class PostService {
    #postRepository;
    constructor() {
        this.#postRepository = new PostRepository(
            Posts,
            Users,
            Comments,
            likes
        );
    }

    createPost = async ({ userId, title, content }) => {
        const data = await this.#postRepository.createPost(
            userId,
            title,
            content
        );
        if (!data) throw ValidationError('게시글 작성에 실패하였습니다.', 400);
        return data;
    };

    findAllPost = async () => {
        const allPost = await this.#postRepository.findAllPost();
        if (!allPost)
            throw ValidationError('게시글 조회에 실패하였습니다.', 400);

        return allPost.map((post) => {
            return {
                userId: post.userId,
                nickname: post.Posts.Users.nickname,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                likes: post.Posts.likes.length,
            };
        });
    };

    findPostById = async (postId) => {
        const findPost = await this.#postRepository.findPostById(postId);

        if (!findPost)
            throw new ValidationError('게시글 조회에 실패하였습니다.', 400);

        let comments = [];
        if (findPost.Comments.length) {
            findPost.Comments.forEach((e) => {
                comments.push({
                    commentId: e.commentId,
                    nickname: e.Users.nickname,
                    content: e.content,
                    createdAt: e.createdAt,
                    updatedAt: e.updatedAt,
                });
            });
        }
        return res.status(200).json({
            data: {
                postId: findPost.postId,
                userId: findPost.userId,
                nickname: findPost.Users.nickname,
                title: findPost.title,
                content: findPost.content,
                createdAt: findPost.createdAt,
                updatedAt: findPost.updatedAt,
                likes: findPost.likes.length,
                comments,
            },
        });
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
