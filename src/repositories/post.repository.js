const InternalServerError = require('../exceptions/index.exception.js');

class PostRepository {
    #PostsModel;
    #UsersModel;
    #CommentsModel;
    #likesModel;
    constructor(PostsModel, UsersModel, CommentsModel, likesModel) {
        this.#PostsModel = PostsModel;
        this.#UsersModel = UsersModel;
        this.#CommentsModel = CommentsModel;
        this.#likesModel = likesModel;
    }

    createPost = async (userId, title, content) => {
        const createPostData = await this.#PostsModel.create({
            userId,
            title,
            content,
        });
        return createPostData;
    };

    findAllPost = async () => {
        const data = await this.#PostsModel.findAll({
            include: [
                { model: this.#UsersModel, attributes: ['nickname'] },
                {
                    model: this.#likesModel,
                    as: 'likes',
                    attributes: ['likeId'],
                },
            ],
            // 내림차순 정렬
            order: [['createdAt', 'DESC']],
        });
        return data;
    };

    findPostById = async (postId) => {
        const post = await this.#PostsModel.findOne({
            where: { postId },
            include: [
                { model: this.#UsersModel, attributes: ['nickname'] },
                {
                    model: this.#likesModel,
                    as: 'likes',
                    attributes: ['likeId'],
                },
                {
                    model: this.#CommentsModel,
                    as: 'Comments',
                    order: [['createdAt', 'DESC']],
                    attributes: [
                        'commentId',
                        'content',
                        'createdAt',
                        'updatedAt',
                    ],
                    include: [
                        { model: this.#UsersModel, attributes: ['nickname'] },
                    ],
                },
            ],
        });
        return post;
    };

    updatePost = async (userId, postId, title, content) => {
        const result = await this.#PostsModel.update(
            { title, content },
            { where: { postId: postId, userId: userId } }
        );
        return result;
    };
}

module.exports = PostRepository;
