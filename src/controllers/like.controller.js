const LikeService = require('../services/like.service.js');
// const PostService = require('../services/post.service.js');
const { InvalidParamsError } = require('../exceptions/index.exception');
class LikeController {
    #likeService;
    #postService;
    constructor() {
        this.#likeService = new LikeService();
        // this.#postService = new PostService();
    }

    getAllLikedPosts = async (req, res, next) => {
        try {
            const { userId } = req.body;

            if(!userId) throw new InvalidParamsError();

            const postLike = await this.#likeService.getAllLikedPosts({
                userId,
            });

            res.status(200).json({ data: postLike });
        } catch (error) {
            next(error);
        }
    };

    createPostLike = async (req, res, next) => {
        // try {
            const { userId } = req.body;
            const { postId } = req.params;

            if(!userId) throw new InvalidParamsError();

            // PostService 확인하고 게시물 없을시 return문 추가
            // const existPost = this.#postService.findPostById({ postId });
            
            // if(!existPost) throw new InvalidParamsError('존재하지 않는 게시물입니다.', 404);

            const isLike = await this.#likeService.createPostLike(
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
        // } catch (error) {
        //     next(error)
        // }
    };
}

module.exports = LikeController;