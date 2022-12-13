const { Users, Posts, Comments } = require('../models');
const InternalServerError = require('../exceptions/index.exception.js');

class PostRepository extends Posts {
    constructor() {
        super();
    }

    createPost = async ({ userId, title, content }) => {
        console.log(userId, title, content);
        const createPostData = await Posts.create({
            userId,
            title,
            content,
        });
        return createPostData;
    };

    findAllPost = async () => {
        const posts = await Posts.findAll();
        return posts;
    };

    findPostById = async (postId) => {
        const post = await Posts.findByPk(postId);
        return post;
    };
}

module.exports = PostRepository;
