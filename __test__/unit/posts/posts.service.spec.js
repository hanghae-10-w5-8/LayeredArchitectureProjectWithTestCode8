const PostService = require('../../../src/services/post.service');
const { ValidationError } = require('../../../src/exceptions/index.exception');

const mockPostRepository = {
    deletePost: jest.fn(),
    findPost: jest.fn()
};

const postServiceParams = {
    userId: 'userId',
    postId: 'postId'
};

const postService = new PostService(mockPostRepository);
postService.postRepository = mockPostRepository;

describe('post Service Layer Test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('post Service deletePost Success Case', async () => {
        mockPostRepository.deletePost = jest.fn(() => {
            return 'deletePost result';
        });

        const deletePostData = await postService.deletePost(postServiceParams.userId, postServiceParams.postId);

        expect(mockPostRepository.deletePost).toHaveBeenCalledTimes(1);
        expect(mockPostRepository.deletePost).toHaveBeenCalledWith(postServiceParams.userId, postServiceParams.postId);
        expect(deletePostData).toEqual('deletePost result');
    });

    test('post Service deletePost Failed Case', async () => {
        mockPostRepository.deletePost = jest.fn(() => {
            return 0;
        });

        try {
            await postService.deletePost( postServiceParams.userId, postServiceParams.postId );
        } catch (err) {
            expect(mockPostRepository.deletePost).toHaveBeenCalledTimes(1);
            expect(mockPostRepository.deletePost).toHaveBeenCalledWith(postServiceParams.userId, postServiceParams.postId);
            expect(err).toBeInstanceOf(ValidationError);
            expect(err.status).toEqual(412);
            expect(err.message).toEqual(
                '게시글이 정상적으로 삭제되지 않았습니다.'
            )
        }
    });

    test('post Service findPost Success Case', async () => {
        mockPostRepository.findPost = jest.fn(() => {
            return 'findPost result';
        });

        const findPostData = await postService.findPost(postServiceParams.postId);

        expect(mockPostRepository.findPost).toHaveBeenCalledTimes(1);
        expect(mockPostRepository.findPost).toHaveBeenCalledWith(postServiceParams.postId);
        expect(findPostData).toEqual('findPost result');
    });

    test('post Service findPost Failed Case', async () => {
        mockPostRepository.findOne = jest.fn(() => {
            return null;
        });

        try {
            await postService.findPost(postServiceParams.postId);
        } catch (err) {
            expect(mockPostRepository.findPost).toHaveBeenCalledTimes(1);
            expect(mockPostRepository.findPost).toHaveBeenCalledWith(postServiceParams.postId);
            expect(err).toBeInstanceOf(ValidationError);
            expect(err.status).toEqual(412);
            expect(err.message).toEqual(
                '존재하지 않는 게시물 입니다.'
            )
        }
    });

});