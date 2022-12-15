const CommentService = require("../../../src/services/comment.service.js");

let mockCommentModel = {
    createdComment: jest.fn(),
    editComment: jest.fn(),
    deleteComment: jest.fn(),
    getComment: jest.fn(),
    findComment: jest.fn(),
}

let commentService = new CommentService();
commentService.commentRepository = mockCommentModel;



describe('Layered Architecture Pattern Comment Service Unit Test', () => {

    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    })

    test('Comment Service getComments Method', async () => {

        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.

        const findAllCommentReturnValue = [
            {
                commentId: 1,
                nickname: "Nickname_1",
                content: "test",
                createdAt: new Date('06 October 2022 15:50 UTC'),
                updatedAt: new Date('06 October 2022 15:50 UTC'),
            },
            {
                commentId: 2,
                nickname: "Nickname_2",
                content: "test",
                createdAt: new Date('07 October 2022 15:50 UTC'),
                updatedAt: new Date('07 October 2022 15:50 UTC'),
            },
        ]

        mockCommentModel.getComment = jest.fn(() => {
            return findAllCommentReturnValue;
        })

        // postRepository의 findAllPost Method를 호출합니다.
        const comment = await commentService.getComment({postId:1});

        expect(comment).toEqual(
            findAllCommentReturnValue.sort((a, b) => {
                return b.createdAt - a.createdAt;
            })
        );

        expect(mockCommentModel.getComment).toHaveBeenCalledTimes(1);
    });

    test('Comment Service getComments Error', async () => {

        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.

        const findAllCommentReturnValue = null

        mockCommentModel.getComment = jest.fn(() => {
            return findAllCommentReturnValue;
        })

        // postRepository의 findAllPost Method를 호출합니다.

        try {
            const comment = await commentService.getComment({postId:1});
        }catch(error){
            expect(mockCommentModel.getComment).toHaveBeenCalledTimes(1);
            expect(mockCommentModel.getComment).toHaveBeenCalledWith({postId:1});

            // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("Post doesn't exist");
            expect(error.message).toEqual("댓글 조회에 실패하였습니다.");
        }
    });

    test('Comment Service Delete Test', async () => {

        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.

        const findCommentReturnValue = {
                commentId: 1,
                postId: 1,
                userId: 1,
                content: "test",
                createdAt: new Date('06 October 2022 15:50 UTC'),
                updatedAt: new Date('06 October 2022 15:50 UTC'),
        };

        mockCommentModel.findComment = jest.fn(() => {
            return findCommentReturnValue;
        })

        // postRepository의 findAllPost Method를 호출합니다.


        const comment = await commentService.deleteComment({commentId:1, userId:1});

        expect(mockCommentModel.findComment).toHaveBeenCalledTimes(1);
        expect(mockCommentModel.findComment).toHaveBeenCalledWith({
            commentId:findCommentReturnValue.commentId,
            userId:findCommentReturnValue.userId
        });
        expect(mockCommentModel.deleteComment).toHaveBeenCalledTimes(1);
        expect(mockCommentModel.deleteComment).toHaveBeenCalledWith({
            commentId:findCommentReturnValue.commentId,
            userId:findCommentReturnValue.userId
        })

    });

    test('Comment Service Delete Error', async () => {
        const deleteCommentReturnValue = null

        mockCommentModel.getComment = jest.fn(() => {
            return deleteCommentReturnValue;
        })

        try {
            await commentService.deleteComment({commentId:1, userId:1});
        }catch(error){
            expect(mockCommentModel.findComment).toHaveBeenCalledTimes(1);
            expect(mockCommentModel.findComment).toHaveBeenCalledWith({commentId:1, userId:1});

            // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("Post doesn't exist");
            expect(error.message).toEqual("댓글이 존재하지 않습니다.");
        }
    });


    test('Comment Service Edit Test', async () => {

        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        const findCommentReturnValue = {
            commentId: 1,
            postId: 1,
            userId: 1,
            content: "test",
            createdAt: new Date('06 October 2022 15:50 UTC'),
            updatedAt: new Date('06 October 2022 15:50 UTC'),
        };

        const editCommentReturnValue = {
            commentId: 1,
            postId: 1,
            userId: 1,
            content: "TESTTEST!",
            createdAt: new Date('06 October 2022 15:50 UTC'),
            updatedAt: new Date('06 October 2022 15:50 UTC'),
        };

        mockCommentModel.findComment = jest.fn(() => {
            return findCommentReturnValue;
        })

        mockCommentModel.editComment = jest.fn(()=>{
            return editCommentReturnValue;
        })

        // postRepository의 findAllPost Method를 호출합니다.


        const comment = await commentService.editComment({
            commentId:editCommentReturnValue.commentId,
            userId:editCommentReturnValue.userId,
            comment: editCommentReturnValue.content
        });

        expect(mockCommentModel.findComment).toHaveBeenCalledTimes(1);
        expect(mockCommentModel.findComment).toHaveBeenCalledWith({
            commentId:findCommentReturnValue.commentId,
            userId:findCommentReturnValue.userId
        });

        expect(mockCommentModel.editComment).toHaveBeenCalledTimes(1);
        expect(mockCommentModel.editComment).toHaveBeenCalledWith({
            commentId:editCommentReturnValue.commentId,
            userId:editCommentReturnValue.userId,
            comment:editCommentReturnValue.content
        })

    });

    test('Comment Service Edit Error', async () => {

        const findCommentReturnValue = {
            commentId: 1,
            postId: 1,
            userId: 1,
            content: "test",
            createdAt: new Date('06 October 2022 15:50 UTC'),
            updatedAt: new Date('06 October 2022 15:50 UTC'),
        };
        const editCommentReturnValue = null

        mockCommentModel.findComment = jest.fn(() => {
            return null;
        })

        mockCommentModel.editComment = jest.fn(()=>{
            return editCommentReturnValue;
        })


        try {
            const comment = await commentService.editComment({
                commentId:1,
                userId:1,
                comment: "TEST!!"
            });
        }catch (error){
            expect(mockCommentModel.findComment).toHaveBeenCalledTimes(1);
            expect(mockCommentModel.findComment).toHaveBeenCalledWith({commentId:1, userId:1});

            // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("Post doesn't exist");
            expect(error.message).toEqual("댓글이 존재하지 않습니다.");
        }

        mockCommentModel.findComment = jest.fn(() => {
            return findCommentReturnValue;
        });

        try {
            const comment = await commentService.editComment({
                commentId:1,
                userId:1,
                comment: "TEST!!"
            });
        }catch (error){
            expect(mockCommentModel.editComment).toHaveBeenCalledTimes(1);
            expect(mockCommentModel.editComment).toHaveBeenCalledWith({commentId:1, userId:1,comment: "TEST!!"});

            // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("Post doesn't exist");
            expect(error.message).toEqual("댓글 수정이 정상적으로 처리되지 않았습니다.");
        }
    });

    test('Comment Service Create Test', async () => {

        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        const createCommentReturnValue = {
            postId: 1,
            userId: 1,
            comment: "test",
            createdAt: new Date('06 October 2022 15:50 UTC'),
            updatedAt: new Date('06 October 2022 15:50 UTC'),
        };

        mockCommentModel.createdComment = jest.fn(() => {
            return createCommentReturnValue;
        })

        const comment = await commentService.createdComment({
            postId:createCommentReturnValue.postId,
            userId:createCommentReturnValue.userId,
            comment: createCommentReturnValue.comment
        });

        expect(mockCommentModel.createdComment).toHaveBeenCalledTimes(1);
        expect(mockCommentModel.createdComment).toHaveBeenCalledWith({
            postId:createCommentReturnValue.postId,
            userId:createCommentReturnValue.userId,
            comment: createCommentReturnValue.comment
        });
    });

    test('Comment Service Create Error', async () => {

        // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
        const createCommentReturnValue = {
            postId: 1,
            userId: 1,
            comment: "test",
            createdAt: new Date('06 October 2022 15:50 UTC'),
            updatedAt: new Date('06 October 2022 15:50 UTC'),
        };

        mockCommentModel.createdComment = jest.fn(() => {
            return null;
        })

        try {
            const comment = await commentService.createdComment({
                postId:createCommentReturnValue.postId,
                userId:createCommentReturnValue.userId,
                comment: createCommentReturnValue.comment
            });
        }catch (error){
            expect(mockCommentModel.createdComment).toHaveBeenCalledTimes(1);
            expect(mockCommentModel.createdComment).toHaveBeenCalledWith({
                postId:createCommentReturnValue.postId,
                userId:createCommentReturnValue.userId,
                comment: createCommentReturnValue.comment
            });

            expect(error.message).toEqual("댓글 작성에 실패하였습니다.");
        }
    });

});
