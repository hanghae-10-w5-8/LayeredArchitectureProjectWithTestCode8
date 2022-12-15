const LikeRepository = require('../../../src/repositories/like.repository');
const { Posts, Users, likes } = require('../../../src/models');
const { Op } = require('sequelize');

const mockLikeModel = () => ({
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
});

const likeParams = {
    userId: "userId",
    postId: "postId",
}

const likeRepository = new LikeRepository(mockLikeModel);

describe('likes Repository Layer Test', () => {
    

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Like Repository getAllLikedPosts Success Case', async () => {
        mockLikeModel.findAll = jest.fn(() => {
            return 'findAll result';
        });

        const getAllLikedPostsData = await likeRepository.getAllLikedPosts( likeParams.userId );

        expect(getAllLikedPostsData).toEqual('findAll result');
        expect(mockLikeModel.findAll).toHaveBeenCalledTimes(1);
        expect(mockLikeModel.findAll).toHaveBeenCalledWith({
            where: { userId: likeParams.userId },
            include: [
                {
                    model: Posts,
                    attributes: { exclude: ['content', 'postId'] },
                    include: [
                        { model: likes, as: 'likes', attributes: ['likeId'] },
                        { model: Users, attributes: ['nickname'] },
                    ],
                },
            ],
        });
    });

    test('Like Repository createPostLike', async () => {
        mockLikeModel.findOne = jest.fn(() => {
            return 'findOne result';
        })

        const createPostLikeData = await likeRepository.createPostLike(
            likeParams.postId,
            likeParams.userId,
        );

        expect(createPostLikeData).toEqual('findOne result');
        expect(mockLikeModel.findOne).toHaveBeenCalledTimes(1);
        expect(mockLikeModel.findOne).toHaveBeenCalledWith({
            where: {
                [Op.and]: [
                    { postId: likeParams.postId }, 
                    { userId: likeParams.userId }                  
                ],
            },
        }); 
    });

    test('Like Repository createLike', async () => {
        mockLikeModel.create = jest.fn(() => {
            return 'create result';
        });

        const createLikeData = await likeRepository.createLike(
            likeParams.postId,
            likeParams.userId,
        );

        expect(createLikeData).toEqual('create result');
        expect(mockLikeModel.create).toHaveBeenCalledTimes(1);
        expect(mockLikeModel.create).toHaveBeenCalledWith({
            postId: likeParams.postId,
            userId: likeParams.userId,
        });
    });

    test('Like Repository deleteLike', async () => {
        mockLikeModel.destroy = jest.fn(() => {
            return 'destroy result';
        });

        const destroyLikeData = await likeRepository.deleteLike(
            likeParams.postId,
            likeParams.userId,
        );

        expect(destroyLikeData).toEqual('destroy result');
        expect(mockLikeModel.destroy).toHaveBeenCalledTimes(1);
        expect(mockLikeModel.destroy).toHaveBeenCalledWith({
            where: {
                [Op.and]: [
                    { postId: likeParams.postId }, 
                    { userId: likeParams.userId }                  
                ],
            },
        });

    });
});
