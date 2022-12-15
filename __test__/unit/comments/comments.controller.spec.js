const CommentController = require("../../../src/controllers/comment.controller.js");
const auth = require("")
let mockCommentService = () => ({
    createComment: jest.fn(),
    editComment: jest.fn(),
    deleteComment: jest.fn(),
    getComment: jest.fn(),
    findComment: jest.fn(),
});

let mockRequest = {
    body: jest.fn(),
    params: jest.fn()
};

let mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
};

let mockNext = jest.fn()

let commentController = new CommentController();
commentController.commentService = mockCommentService();
describe('Layered Architecture Pattern Comment Controller Unit Test', () => {
    // 각 test가 실행되기 전에 실행됩니다.


    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

        // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
    });

    test('Posts Controller getComment Method by Success', async () => {
        // PostService의 findAllPost Method를 실행했을 때 Return 값을 변수로 선언합니다.
        const commentReturnValue = [
            {
                postId: 1,
                commentId: 1,
                comment: 'TEST',
                nickname: 'test',
                createdAt: new Date('07 October 2011 15:50 UTC'),
                updatedAt: new Date('07 October 2011 15:50 UTC'),
            },
            {
                postId: 1,
                commentId: 2,
                comment: 'TEST',
                nickname: 'test',
                createdAt: new Date('06 October 2011 15:50 UTC'),
                updatedAt: new Date('06 October 2011 15:50 UTC'),
            },
        ];

        mockRequest.params = {postId:1}

        commentController.commentService.getComment = jest.fn(() => {
            return commentReturnValue;
        });
        // PostsController의 getPosts Method를 실행합니다.
        await commentController.getComment(mockRequest, mockResponse,mockNext);

        expect(commentController.commentService.getComment).toHaveBeenCalledTimes(1);

        expect(mockResponse.status).toBeCalledWith(200);


        expect(commentController.commentService.getComment).toHaveBeenCalledWith(
            mockRequest.params
        );
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            result: commentReturnValue,
        });
    });

    test('Posts Controller getComment Method Error', async () => {
        // PostService의 findAllPost Method를 실행했을 때 Return 값을 변수로 선언합니다.
        mockRequest.params = null

        try {
            await commentController.getComment(mockRequest, mockResponse,mockNext);
        }catch (error){
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(error.message).toEqual('요청한 데이터 형식이 올바르지 않습니다.');
            expect(error.status).toEqual(412);

        }
    });

    test('Posts Controller deleteComment Method by Success', async () => {
        // PostService의 findAllPost Method를 실행했을 때 Return 값을 변수로 선언합니다.
        const commentReturnValue = [
            {
                postId: 1,
                commentId: 1,
                comment: 'TEST',
                nickname: 'test',
                createdAt: new Date('07 October 2011 15:50 UTC'),
                updatedAt: new Date('07 October 2011 15:50 UTC'),
            },
            {
                postId: 1,
                commentId: 2,
                comment: 'TEST',
                nickname: 'test',
                createdAt: new Date('06 October 2011 15:50 UTC'),
                updatedAt: new Date('06 October 2011 15:50 UTC'),
            },
        ];

        mockRequest.params = {postId:1}

        commentController.commentService.getComment = jest.fn(() => {
            return commentReturnValue;
        });
        // PostsController의 getPosts Method를 실행합니다.
        await commentController.getComment(mockRequest, mockResponse,mockNext);

        expect(commentController.commentService.getComment).toHaveBeenCalledTimes(1);

        expect(mockResponse.status).toBeCalledWith(200);


        expect(commentController.commentService.getComment).toHaveBeenCalledWith(
            mockRequest.params
        );
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            result: commentReturnValue,
        });
    });

    test('Posts Controller deleteComment Method by Success', async () => {
        // PostService의 findAllPost Method를 실행했을 때 Return 값을 변수로 선언합니다.
        try {
            await commentController.getComment(mockRequest, mockResponse,mockNext);
        }catch (error){
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(error.message).toEqual('요청한 데이터 형식이 올바르지 않습니다.');
            expect(error.status).toEqual(412);

        }
    });

});
