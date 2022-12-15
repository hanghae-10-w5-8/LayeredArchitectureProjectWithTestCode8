// const PostController = require('../../../src/controllers/post.controller');

// const mockPostService = {
//     deletePost: jest.fn(),
// };

// const mockRequest = {
//     body: jest.fn(),
// };

// const mockResponse = {
//     status: jest.fn(),
// };

// const mockNext = jest.fn();

// const postController = new PostController();
// postController.mockPostService = mockPostService;

// describe('post Controller Layer Test', () => {
//     beforeEach(() => {
//         jest.resetAllMocks();

//         mockResponse.status = jest.fn(() => {
//             return mockResponse;
//         });
//     });

//     test('postController deletePost Failed Case', async () => {
//         mockRequest.body = {
//             userId: '1'
//         };

//         mockRequest.params = {
//             postId: '1'
//         };

//         mockPostService.findPost = jest.fn(() => {
//             throw new err('에러발생');
//         });

//         await postController.deletePost(mockRequest, mockResponse, mockNext);

//         expect(mockNext).toHaveBeenCalledWith(Error('요청한 데이터 형식이 올바르지 않습니다.'));
//     })
// })