const PostRepository = require('../../../src/repositories/post.repository');
const { Posts } = require('../../../src/models');

const mockPostModel = () => ({
    destroy: jest.fn(),
    findOne: jest.fn()
});

const postRepository = new PostRepository(Posts);
postRepository.Posts = mockPostModel;

const postRepositoryParams = {
        userId: 'userId',
        postId: 'postId'
};

describe('post Repository Layer Test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('post Repository deletePost', async () => {

        mockPostModel.destroy = jest.fn(() => {
            return 'deletePost result';
        });

        const deletedPostData = await postRepository.deletePost( postRepositoryParams.userId, postRepositoryParams.postId);
        
        expect(deletedPostData).toEqual('deletePost result');
        expect(mockPostModel.destroy).toHaveBeenCalledTimes(1);
        expect(mockPostModel.destroy).toHaveBeenCalledWith({
            where: { userId: postRepositoryParams.userId, 
                    postId: postRepositoryParams.postId 
            }
        })
    });

    test('post Repository findPost', async () => {

        mockPostModel.findOne = jest.fn(() => {
            return 'findPost result';
        });

        const findPostData = await postRepository.findPost(postRepositoryParams.postId);
        
        expect(findPostData).toEqual('findPost result');
        expect(mockPostModel.findOne).toHaveBeenCalledTimes(1);
        expect(mockPostModel.findOne).toHaveBeenCalledWith({
            where: { postId: postRepositoryParams.postId }
        })
    });


    
});


