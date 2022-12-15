// __tests__/unit/posts.repository.unit.spec.js

const CommentRepository = require("../../../src/repositories/comment.repository.js");
const {Op} = require("sequelize");


// comment.repository.js 에서는 아래 5개의 Method만을 사용합니다.
let mockCommentModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
}

let commentRepository = new CommentRepository(mockCommentModel);

describe('Layered Architecture Pattern Comment Repository Unit Test', () => {

    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    })

    test('Comment Repository findAllPost Method', async () => {

        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockCommentModel.findAll = jest.fn(() => {
            return "findAll String"
        });

        // postRepository의 findAllPost Method를 호출합니다.
        const comment = await commentRepository.getComment({});

        // postsModel의 findAll은 1번만 호출 되었습니다.
        expect(commentRepository.Comments.findAll).toHaveBeenCalledTimes(1);

        // mockPostsModel의 Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
        expect(comment).toBe("findAll String");
    });


    test('Comment Repository createComment Method', async () => {
        // create Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockCommentModel.create = jest.fn(() => {
            return "create Return String"
        });

        // createPost Method를 실행하기 위해 필요한 Params 입니다.
        const createCommentParams = {
            postId: 1,
            userId: 1,
            content: "createCommentContent"
        }

        // postRepository의 createPost Method를 실행합니다.
        const createCommentData = await commentRepository.createdComment(
            {
                postId:createCommentParams.postId,
                userId:createCommentParams.userId,
                comment:createCommentParams.content,
            }
        );

        // createPostData는 postsModel의 create를 실행한 결과값을 바로 반환한 값인지 테스트합니다.
        expect(createCommentData).toBe("create Return String");


        // postRepository의 createPost Method를 실행했을 때, postsModel의 create를 1번 실행합니다.
        expect(mockCommentModel.create).toHaveBeenCalledTimes(1);
        //
        // // postRepository의 createPost Method를 실행했을 때, postsModel의 create를 아래와 같은 값으로 호출합니다.
        expect(mockCommentModel.create).toHaveBeenCalledWith({
            postId: createCommentParams.postId,
            userId: createCommentParams.userId,
            content: createCommentParams.content,
        });
    });

    test('Comment Repository findOne Method', async () => {
        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockCommentModel.findOne = jest.fn(() => {
            return "findOne String"
        });
        const findOneCommentParams = {
            commentId: 1,
            userId: 1,
        }


        // postRepository의 findAllPost Method를 호출합니다.
        const comment = await commentRepository.findComment({
            commentId:findOneCommentParams.commentId,
            userId:findOneCommentParams.userId
        });

        // postsModel의 findAll은 1번만 호출 되었습니다.
        expect(commentRepository.Comments.findOne).toHaveBeenCalledTimes(1);

        // mockPostsModel의 Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
        expect(comment).toBe("findOne String");

        expect(mockCommentModel.findOne).toHaveBeenCalledWith({
            where: {
                [Op.and]: [
                    { commentId:findOneCommentParams.commentId },
                    { userId:findOneCommentParams.userId }
                ],
            }
        })
    });

    test('Comment Repository Edit Method', async () => {
        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockCommentModel.update = jest.fn(() => {
            return "updateComment String"
        });

        const updateCommentParams = {
            commentId: 1,
            content: "TEST",
        }


        // postRepository의 findAllPost Method를 호출합니다.
        const comment = await commentRepository.editComment({
            commentId:updateCommentParams.commentId,
            comment:updateCommentParams.content
        });

        // postsModel의 findAll은 1번만 호출 되었습니다.
        expect(commentRepository.Comments.update).toHaveBeenCalledTimes(1);

        // mockPostsModel의 Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
        expect(comment).toBe("updateComment String");

        expect(mockCommentModel.update).toHaveBeenCalledWith(

        {content: updateCommentParams.content},
        {where: { commentId:updateCommentParams.commentId }
        });
    });

    test('Comment Repository Delete Method', async () => {
        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        mockCommentModel.destroy = jest.fn(() => {
            return "DeleteComment String"
        });

        const deleteCommentParams = {
            commentId: 1,
            userId: 1,
        }


        // postRepository의 findAllPost Method를 호출합니다.
        const comment = await commentRepository.deleteComment({
            commentId:deleteCommentParams.commentId,
            userId:deleteCommentParams.userId
        });

        // postsModel의 findAll은 1번만 호출 되었습니다.
        expect(commentRepository.Comments.destroy).toHaveBeenCalledTimes(1);

        // mockPostsModel의 Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
        expect(comment).toBe("DeleteComment String");

        expect(mockCommentModel.destroy).toHaveBeenCalledWith({
            where: {
                [Op.and]: [
                    { commentId:deleteCommentParams.commentId },
                    { userId:deleteCommentParams.userId }
                ],
            }
        });
    });

});
