const PostController = require('../../../src/controllers/post.controller.js');

const mockPostsService = {
    findAllPost: jest.fn(),
    createPost: jest.fn(),
    findPostById: jest.fn(),
    updatePost: jest.fn(),
};

let mockRequest = {
    body: jest.fn(),
};

let mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
    locals: { user: jest.fn() },
};

let mockNext = jest.fn();

let postsController = new PostController();
postsController.postService = mockPostsService;

describe('posts Controller Layer Test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    //////테스트 시작
    test('createPost Method Success Case', async () => {
        const requestBodyParams = {
            title: 'title',
            content: 'content',
        };
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });

        mockRequest.body = requestBodyParams;
        mockResponse.locals.user = 1;
        const createPostReturnValue = {
            postId: 1,
            userId: 1,
            title: 'title',
            content: 'content',
            createdAt: 'aa',
            updatedAt: 'aa',
        };

        postsController.postService.createPost = jest.fn(
            () => createPostReturnValue
        );

        await postsController.createPost(mockRequest, mockResponse, mockNext);

        expect(postsController.postService.createPost).toHaveBeenCalledTimes(1);
        expect(postsController.postService.createPost).toHaveBeenCalledWith(
            mockResponse.locals.user,
            requestBodyParams.title,
            requestBodyParams.content
        );
        // 2. res.status는 1번 호출되고, 201의 값으로 호출됩니다.
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        // 3. PostService.cretePost에서 반환된 createPostData 변수를 이용해 res.json Method가 호출됩니다.
        expect(mockResponse.json).toHaveBeenCalledWith({
            result: createPostReturnValue,
        });
    });
});
