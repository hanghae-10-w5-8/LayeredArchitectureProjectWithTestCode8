const LikeService = require('../services/like.service.js');
const { InvalidParamsError } = require('../exceptions/index.exception');
class LikeController {
    likeService = new LikeService();

    getAllLikedPosts = async (req, res, next) => {
        try {
            const userId  = res.locals.user;

            // if(!userId) throw new InvalidParamsError();

            const postLike = await this.likeService.getAllLikedPosts( userId );

            res.status(200).json({ data: postLike });
        } catch (error) {
            next(error);
        }
    };

    createPostLike = async (req, res, next) => {
        try {
            const userId = res.locals.user;
            const { postId } = req.params;

            console.log(userId);

            if(!userId) throw new InvalidParamsError();

            const isLike = await this.likeService.createPostLike(
                postId,
                userId,
            );

            if (isLike) {
                return res
                    .status(201)
                    .json({ message: '게시글의 좋아요를 취소하였습니다.' });
            }

            res.status(201).json({
                message: '게시글의 좋아요를 등록하였습니다.',
            });
        } catch (error) {
            next(error)
        }
    };
}

module.exports = LikeController;