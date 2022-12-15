const LikeController = require('../../../src/controllers/like.controller');


const mockPostService = {
    getAllLikedPosts: jest.fn(),
    createPostLike: jest.fn(),
};

const mockRequest = {
    body: jest.fn(),
};

const mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
    locals: { user: jest.fn() },
};

const mockNext = jest.fn();

const likeController = new LikeController();
likeController.likeService = mockPostService;

describe('Like Controller getAllLikedPosts', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
    });
    
    test('Like Controller getAllLikedPosts Success Case', async () => {
        
        mockResponse.locals.user = 1;

        mockPostService.getAllLikedPosts = jest.fn(() => {
            return 'getAllLiked result';
        });

        await likeController.getAllLikedPosts(mockRequest, mockResponse, mockNext);

        expect(mockPostService.getAllLikedPosts).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            data: 'getAllLiked result'
        })
    });

    test('Like Controller getAllLikesPosts Failed Case', async () => {
        
        mockResponse.locals.user = null;

        await likeController.getAllLikedPosts(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith(Error('요청한 데이터 형식이 올바르지 않습니다.'));
    });

    test('Like Controller createPostLike Success Case', async () => {

        mockResponse.locals.user = 1;
        mockRequest.params = { postId: 1 };

        mockPostService.getAllLikedPosts = jest.fn(() => {
            return true;
        });

        const isLike = await likeController.createPostLike(mockRequest, mockResponse, mockNext);
        console.log(isLike);
        if(isLike) {
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: '게시글의 좋아요를 취소하였습니다.'
            });
        } else {
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: '게시글의 좋아요를 등록하였습니다.'
            });
        }
    });

    test('Like Controller createPostLike Failed Case', async () => {
        mockRequest.body = {
            userId: null
        };


        await likeController.createPostLike(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith(Error('요청한 데이터 형식이 올바르지 않습니다.'));
    });
});