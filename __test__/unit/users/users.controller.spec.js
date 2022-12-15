const UsersController = require('../../../src/controllers/users.controller');
const {
    InvalidParamsError,
} = require('../../../src/exceptions/index.exception');
const mockUsersService = () => ({
    createUser: jest.fn(),
    logInUser: jest.fn(),
});
let mockRequest = {
    body: jest.fn(),
};
let mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
    cookie: jest.fn(),
};
let mockNext = jest.fn();

describe('users Controller Layer Test', () => {
    let usersController = new UsersController();
    usersController.usersService = mockUsersService();
    const requestBodyParams = {
        nickname: 'nickname',
        password: 'password',
        confirm: 'password',
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('createUser Method Success Case', async () => {
        mockRequest.body = requestBodyParams;
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
        usersController.usersService.createUser = jest.fn(() => {
            return 'success';
        });

        await usersController.createUser(mockRequest, mockResponse);

        expect(usersController.usersService.createUser).toHaveBeenCalledTimes(
            1
        );
        expect(usersController.usersService.createUser).toHaveBeenCalledWith(
            requestBodyParams.nickname,
            requestBodyParams.password,
            requestBodyParams.confirm
        );
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: '회원 가입에 성공하였습니다.',
        });
    });

    test('createUser Method Fail Case by invalid parameters', async () => {
        try {
            mockRequest.body = {};

            await usersController.createUser(
                mockRequest,
                mockResponse,
                mockNext
            );
        } catch (error) {
            expect(
                usersController.usersService.createUser
            ).toHaveBeenCalledTimes(0);
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(error).toBeInstanceOf(InvalidParamsError);
            expect(error.message).toEqual(
                '요청한 데이터 형식이 올바르지 않습니다.'
            );
            expect(error.status).toEqual(400);
        }
    });

    test('createUser Method Fail Case by missing nickname', async () => {
        try {
            mockRequest.body = {
                confirm: requestBodyParams.confirm,
                passord: requestBodyParams.password,
            };

            await usersController.createUser(
                mockRequest,
                mockResponse,
                mockNext
            );
        } catch (error) {
            expect(
                usersController.usersService.createUser
            ).toHaveBeenCalledTimes(0);
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(error).toBeInstanceOf(InvalidParamsError);
            expect(error.message).toEqual(
                '요청한 데이터 형식이 올바르지 않습니다.'
            );
            expect(error.status).toEqual(400);
        }
    });

    test('createUser Method Fail Case by missing password', async () => {
        try {
            mockRequest.body = {
                nickname: requestBodyParams.nickname,
                confirm: requestBodyParams.password,
            };

            await usersController.createUser(
                mockRequest,
                mockResponse,
                mockNext
            );
        } catch (error) {
            expect(
                usersController.usersService.createUser
            ).toHaveBeenCalledTimes(0);
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(error).toBeInstanceOf(InvalidParamsError);
            expect(error.message).toEqual(
                '요청한 데이터 형식이 올바르지 않습니다.'
            );
            expect(error.status).toEqual(400);
        }
    });

    test('createUser Method Fail Case by missing confirm', async () => {
        try {
            mockRequest.body = {
                nickname: requestBodyParams.nickname,
                passord: requestBodyParams.password,
            };

            await usersController.createUser(
                mockRequest,
                mockResponse,
                mockNext
            );
        } catch (error) {
            expect(
                usersController.usersService.createUser
            ).toHaveBeenCalledTimes(0);
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(error).toBeInstanceOf(InvalidParamsError);
            expect(error.message).toEqual(
                '요청한 데이터 형식이 올바르지 않습니다.'
            );
            expect(error.status).toEqual(400);
        }
    });

    test('logInUser Method Success Case', async () => {
        const logInUserToken = {
            accessToken: 'accessToken',
            accessTokenName: 'accessTokenName',
            refreshToken: 'refreshToken',
            refreshTokenName: 'refreshTokenName',
            cookieExpiration: 'cookieExpiration',
        };
        mockRequest.body = {
            nickname: requestBodyParams.nickname,
            password: requestBodyParams.password,
        };
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
        mockResponse.cookie = jest.fn(() => {
            return mockResponse;
        });
        usersController.usersService.logInUser = jest.fn(() => {
            return logInUserToken;
        });

        const tokens = await usersController.logInUser(
            mockRequest,
            mockResponse
        );

        expect(usersController.usersService.logInUser).toHaveBeenCalledTimes(1);
        expect(usersController.usersService.logInUser).toHaveBeenCalledWith(
            requestBodyParams.nickname,
            requestBodyParams.password
        );
        expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            accessToken: `Bearer[${logInUserToken.accessToken}]`,
            refreshToken: `Bearer[${logInUserToken.refreshToken}]`,
        });
    });

    test('logInUser Method Fail Case by invalid parameters', async () => {
        try {
            mockRequest.body = {};

            await usersController.logInUser(
                mockRequest,
                mockResponse,
                mockNext
            );
        } catch (error) {
            expect(
                usersController.usersService.logInUser
            ).toHaveBeenCalledTimes(0);
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(error).toBeInstanceOf(InvalidParamsError);
            expect(error.message).toEqual(
                '요청한 데이터 형식이 올바르지 않습니다.'
            );
            expect(error.status).toEqual(400);
        }
    });

    test('logInUser Method Fail Case by missing nickname', async () => {
        try {
            mockRequest.body = { password: requestBodyParams.password };

            await usersController.logInUser(
                mockRequest,
                mockResponse,
                mockNext
            );
        } catch (error) {
            expect(
                usersController.usersService.logInUser
            ).toHaveBeenCalledTimes(0);
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(error).toBeInstanceOf(InvalidParamsError);
            expect(error.message).toEqual(
                '요청한 데이터 형식이 올바르지 않습니다.'
            );
            expect(error.status).toEqual(400);
        }
    });

    test('logInUser Method Fail Case by missing password', async () => {
        try {
            mockRequest.body = { nickname: requestBodyParams.nickname };

            await usersController.logInUser(
                mockRequest,
                mockResponse,
                mockNext
            );
        } catch (error) {
            expect(
                usersController.usersService.logInUser
            ).toHaveBeenCalledTimes(0);
            expect(mockNext).toHaveBeenCalledWith(error);
            expect(error).toBeInstanceOf(InvalidParamsError);
            expect(error.message).toEqual(
                '요청한 데이터 형식이 올바르지 않습니다.'
            );
            expect(error.status).toEqual(400);
        }
    });
});
