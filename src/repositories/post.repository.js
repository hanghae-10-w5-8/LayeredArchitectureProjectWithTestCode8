const { Users, Posts, Comments, likes } = require('../models');
const InternalServerError = require('../exceptions/index.exception.js');

class PostRepository {
    constructor(Posts, Users, Comments, likes) {
        this.Posts = Posts;
        this.Users = Users;
        this.Comments = Comments;
        this.likes = likes;
    }

    createPost = async ({ userId, title, content }) => {
        const createPostData = await Posts.create(userId, title, content);
        return createPostData;
    };

    findAllPost = async () => {
        const data = await Posts.findAll({
            include: [
                { model: Users, attributes: ['nickname'] },
                { model: likes, as: 'likes', attributes: ['likeId'] },
            ],
            // 내림차순 정렬
            order: [['createdAt', 'DESC']],
        });
        return data;
    };

    findPostById = async (postId) => {
        const post = await Posts.findOne({
            where: { postId },
            include: [
                { model: Users, attributes: ['nickname'] },
                { model: likes, as: 'likes', attributes: ['likeId'] },
                {
                    model: Comments,
                    as: 'Comments',
                    order: [['createdAt', 'DESC']],
                    attributes: [
                        'commentId',
                        'content',
                        'createdAt',
                        'updatedAt',
                    ],
                    include: [{ model: Users, attributes: ['nickname'] }],
                },
            ],
        });
        return post;
    };

    updatePost = async ({ postId, title, content }) => {
        const result = await Posts.update(
            { title, content },
            { where: { postId: postId } }
        );
        return result;
    };

    deletePost = async (userId, postId) => {
        const deletedPost = await this.Posts.destroy({
            where: { userId, postId }
        });

        return deletedPost;
    }

    findPost = async (postId) => {
        const existPost = await this.Posts.findOne({
            where: { postId }
        });

        return existPost;
    }
}

module.exports = PostRepository;
