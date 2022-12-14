const LikeRepository = require('../repositories/like.repository');
const { InvalidParamsError } = require('../exceptions/index.exception.js');
class LikeService {
    #likeRepository;
    constructor() {
        this.#likeRepository = new LikeRepository();
    }

    getAllLikedPosts = async ( userId ) => {
        const data = await this.#likeRepository.getAllLikedPosts( userId  );

        if (!data)
            throw new ValidationError(
                '좋아요 게시글 조회에 실패하였습니다.',
                400
            );

        return data
            .map((v) => {
                return {
                    postId: v.postId,
                    userId: v.userId,
                    nickname: v.Post.User.nickname,
                    title: v.Post.title,
                    createdAt: v.createdAt,
                    updatedAt: v.updatedAt,
                    likes: v.Post.likes.length,
                };
            })
            .sort((a, b) => b.likes - a.likes);
    };

    createPostLike = async ( postId, userId ) => {
        const existLike = await this.#likeRepository.createPostLike(
            postId,
            userId,
        );

        if(!existLike) {
            await this.#likeRepository.createLike( postId, userId );
        } else {
            await this.#likeRepository.deleteLike( postId, userId );
        }

        return existLike;
    };
}

module.exports = LikeService;