const LikeService = require('../../../src/services/like.service.js');
const { InvalidParamsError } = require('../../../src/exceptions/index.exception.js');

const mockLikeRepository = {
    getAllLikedPosts: jest.fn(),
    createPostLike: jest.fn(),
    createLike: jest.fn(),
    deleteLike: jest.fn(),
};

const likeService = new LikeService();
likeService.likeRepository = mockLikeRepository;

const likeServiceParams = {
    userId: 1,
    postId: 1,
}

describe('likes Service Layer Test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Like Service getAllLikedPosts Success Case', async () => {
        const getAllLikedPostsReturnValue = [
            {
                postId : 1,
                userId : 1,
                Post : { User: { nickname: "Nickname_1"}, title: 'Title_1', likes: { length: 1}},
                createdAt : new Date('11 October 2022 00:00'),
                updatedAt : new Date('11 October 2022 00:00'),
            },
            {
                postId : 2,
                userId : 1,
                Post : { User: { nickname: "Nickname_1"}, title: 'Title_2', likes: { length: 2}},
                createdAt : new Date('12 October 2022 00:00'),
                updatedAt : new Date('12 October 2022 00:00'),
            },
        ];

        const validationGetAllLikedPosts = getAllLikedPostsReturnValue.map(v => {
            return {
                postId: v.postId,
                    userId: v.userId,
                    nickname: v.Post.User.nickname,
                    title: v.Post.title,
                    createdAt: v.createdAt,
                    updatedAt: v.updatedAt,
                    likes: v.Post.likes.length,
            }
        })
        .sort((a, b) => b.likes - a.likes);

        mockLikeRepository.getAllLikedPosts = jest.fn(() => {
            return getAllLikedPostsReturnValue;
        });

        const getAllLikedPostsData = await likeService.getAllLikedPosts( likeServiceParams.userId );

        // 1. getAllLikedPosts 메서드를 1번호출, 입력받는 인자는 useId
        expect(mockLikeRepository.getAllLikedPosts).toHaveBeenCalledTimes(1);
        expect(mockLikeRepository.getAllLikedPosts).toHaveBeenCalledWith( likeServiceParams.userId );
        expect(getAllLikedPostsData).toEqual(validationGetAllLikedPosts);

    });

    test('Like Service getAllLikedPosts By Not Found Post Error', async () => {
        const getAllLikedPostsReturnValue = null;

        mockLikeRepository.getAllLikedPosts = jest.fn(() => {
            return null;
        });

        try {
            await likeService.getAllLikedPosts(10);
        } catch (err) {
            expect(mockLikeRepository.getAllLikedPosts).toHaveBeenCalledTimes(1);
            expect(mockLikeRepository.getAllLikedPosts).toHaveBeenCalledWith(10);
            expect(err).toBeInstanceOf(InvalidParamsError);
            expect(err.status).toEqual(400);
            expect(err.message).toEqual(
                '좋아요 게시글 조회에 실패하였습니다.'
            )
        }        
    });

    test('Like Service createPostLike', async () => {
        mockLikeRepository.createPostLike = jest.fn(() => {
            return true;
        });    

        const existLike = await likeService.createPostLike( likeServiceParams.postId, likeServiceParams.userId );

        expect(mockLikeRepository.createPostLike).toHaveBeenCalledTimes(1);
        expect(mockLikeRepository.createPostLike).toHaveBeenCalledWith( likeServiceParams.postId, likeServiceParams.userId);

        if(!existLike) {
            expect(mockLikeRepository.createLike).toHaveBeenCalledTimes(1);
            expect(mockLikeRepository.createLike).toHaveBeenCalledWith( likeServiceParams.postId, likeServiceParams.userId);
        } else {
            expect(mockLikeRepository.deleteLike).toHaveBeenCalledTimes(1);
            expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith( likeServiceParams.postId, likeServiceParams.userId)
        }
    })
    
});
