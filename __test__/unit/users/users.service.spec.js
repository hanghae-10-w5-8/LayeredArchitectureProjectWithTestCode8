require('dotenv').config();
const { ValidationError } = require('../../../src/exceptions/index.exception');
const UsersService = require('../../../src/services/users.service.js');
const { hash } = require('../../../src/util/auth-encryption.util.js');
const {
    createToken,
    setCookieExpiration,
} = require('../../../src/util/auth-jwtToken.util');
const env = process.env;

const mockUsersRepository = {
    findUser: jest.fn(),
    createUser: jest.fn(),
};

describe('Users Service Layer Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const userBodyParams = {
        nickname: 'nickname1',
        password: 'password1',
        confirm: 'password1',
    };

    const userReturnValue = {
        userId: 1,
        nickname: userBodyParams.nickname,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    };

    // [createUser-성공케이스] null을 반환
    test('Users Service createUser Method by Success', async () => {
        const usersService = new UsersService();
        usersService.usersRepository = Object.assign({}, mockUsersRepository);

        usersService.usersRepository.createUser = jest.fn(
            () => userReturnValue
        );
        // usersService.findUser는 usersService에 정의된 함수이므로, mock function으로 할당해 주어야 함
        usersService.findUser = jest.fn();
        const createUserHashValue = hash(userBodyParams.password);
        const user = await usersService.createUser(
            userBodyParams.nickname,
            userBodyParams.password,
            userBodyParams.confirm
        );
        // createUser 호출할 때, findUser Services 호출했는지 확인
        expect(usersService.findUser).toHaveBeenCalledWith(
            userBodyParams.nickname
        );
        // createUser 호출할 때, 인자로 어떤 값이었는지 확인
        expect(usersService.usersRepository.createUser).toHaveBeenCalledWith(
            userBodyParams.nickname,
            createUserHashValue
        );
        // createUser가 몇번 호출되었는지 확인
        expect(usersService.usersRepository.createUser).toHaveBeenCalledTimes(
            1
        );
        // usersService.createUser (===user)에서 호출되는 결과값이 Service의 return 값과 일치하는지 확인
        expect(user).toEqual(userReturnValue);
    });

    test('Users Service createUser Method Fail Case By duplicated Id', async () => {
        const validationErrorByDuplicatedIdSchema = {
            nickname: userBodyParams.nickname,
        };
        const usersService = new UsersService();
        usersService.usersRepository = Object.assign({}, mockUsersRepository);
        usersService.usersRepository.createUser = jest.fn(
            () => userReturnValue
        );
        try {
            // usersServices.createUser -> this.findUser -> return object with nickname === (isExistUser) -> throw new ValidationError -> catch block -> check expected values in catch block
            usersService.findUser = jest.fn(
                () => validationErrorByDuplicatedIdSchema
            );

            await usersService.createUser(
                userBodyParams.nickname,
                userBodyParams.password,
                userBodyParams.confirm
            );
        } catch (error) {
            // usersService.findUser 메서드가 usersService.createUser에 전달한 input 값으로 실행 됐는지?
            expect(usersService.findUser).toHaveBeenCalledWith(
                userBodyParams.nickname
            );
            // 닉네임 중복으로 발생한 에러 객체가 ValidationError가 맞는지?
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toEqual('중복된 닉네임입니다.');
            expect(error.status).toEqual(412);
        }
    });

    test('Users Service createUser Method Fail Case By unconfirmed password', async () => {
        const validationErrorByUnconfirmedPassword = {
            password: userBodyParams.password,
            confirm: 'unconfirmed',
        };
        const usersService = new UsersService();
        usersService.usersRepository = Object.assign({}, mockUsersRepository);
        usersService.usersRepository.createUser = jest.fn(
            () => userReturnValue
        );
        try {
            // 중복 아이디 문제 아님. usersService.findUser 메서드는 null 반환
            usersService.findUser = jest.fn(() => null);

            await usersService.createUser(
                userBodyParams.nickname,
                validationErrorByUnconfirmedPassword.password,
                validationErrorByUnconfirmedPassword.confirm
            );
        } catch (error) {
            // usersService.findUser 메서드가 usersService.createUser에 전달한 input 값으로 실행 됐는지?
            expect(usersService.findUser).toHaveBeenCalledWith(
                userBodyParams.nickname
            );
            // 발생한 에러 객체가 ValidationError가 맞는지?
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toEqual('패스워드가 일치하지 않습니다.');
            expect(error.status).toEqual(412);
        }
    });

    test('Users Service createUser Method Fail Case By invalid nickname', async () => {
        const validationErrorByInvalidNickname = 'InvalidId!@#$%';
        const usersService = new UsersService();
        usersService.usersRepository = Object.assign({}, mockUsersRepository);
        usersService.usersRepository.createUser = jest.fn(
            () => userReturnValue
        );
        try {
            // 중복 아이디 문제 아님. usersService.findUser 메서드는 null 반환
            usersService.findUser = jest.fn(() => null);

            await usersService.createUser(
                validationErrorByInvalidNickname,
                userBodyParams.password,
                userBodyParams.password
            );
        } catch (error) {
            // usersService.findUser usersService.createUser에 전달한 input 값으로 실행 됐는지?
            expect(usersService.findUser).toHaveBeenCalledWith(
                validationErrorByInvalidNickname
            );
            // 발생한 에러 객체가 ValidationError가 맞는지?
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toEqual('ID 형식이 일치하지 않습니다.');
            expect(error.status).toEqual(412);
        }
    });

    test('Users Service createUser Method Fail Case By invalid password', async () => {
        const validationErrorByInvalidPassword = 'password!@#$%';
        const usersService = new UsersService();
        usersService.usersRepository = Object.assign({}, mockUsersRepository);
        usersService.usersRepository.createUser = jest.fn(
            () => userReturnValue
        );
        try {
            // 중복 아이디 문제 아님. usersService.findUser 메서드는 null 반환
            usersService.findUser = jest.fn(() => null);

            await usersService.createUser(
                userBodyParams.nickname,
                validationErrorByInvalidPassword,
                validationErrorByInvalidPassword
            );
        } catch (error) {
            // usersService.findUser usersService.createUser에 전달한 input 값으로 실행 됐는지?
            expect(usersService.findUser).toHaveBeenCalledWith(
                userBodyParams.nickname
            );
            // 발생한 에러 객체가 ValidationError가 맞는지?
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toEqual('패스워드 형식이 일치하지 않습니다.');
            expect(error.status).toEqual(412);
        }
    });

    test('Users Service createUser Method Fail Case By nickname in password', async () => {
        const validationErrorByNicknameInPassword = {
            nickname: 'nickname1',
            password: 'nickname1InPassword',
            confirm: 'nickname1InPassword',
        };
        const usersService = new UsersService();
        usersService.usersRepository = Object.assign({}, mockUsersRepository);
        usersService.usersRepository.createUser = jest.fn(
            () => userReturnValue
        );
        try {
            // 중복 아이디 문제 아님. usersService.findUser 메서드는 null 반환
            usersService.findUser = jest.fn(() => null);

            await usersService.createUser(
                validationErrorByNicknameInPassword.nickname,
                validationErrorByNicknameInPassword.password,
                validationErrorByNicknameInPassword.confirm
            );
        } catch (error) {
            // usersService.findUser usersService.createUser에 전달한 input 값으로 실행 됐는지?
            expect(usersService.findUser).toHaveBeenCalledWith(
                validationErrorByNicknameInPassword.nickname
            );
            // 발생한 에러 객체가 ValidationError가 맞는지?
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toEqual(
                '패스워드에 닉네임이 포함되어 있습니다.'
            );
            expect(error.status).toEqual(412);
        }
    });

    // logInUser method를 검증할 때는 UsersService를 새로 할당할 필요 없음
    const usersService = new UsersService();
    usersService.usersRepository = Object.assign({}, mockUsersRepository);
    const logInUserHashValue = hash(userBodyParams.password);

    // [logInUser-성공케이스] token을 반환
    test('Users Service logInUser Method by Success', async () => {
        usersService.usersRepository.authUser = jest.fn(() => userReturnValue);
        const logInUserToken = await usersService.logInUser(
            userBodyParams.nickname,
            userBodyParams.password
        );
        const logInUserTokenReturnValue = {
            accessToken: logInUserToken.accessToken,
            accessTokenName: env.ACCESSTOKEN_NAME,
            refreshToken: logInUserToken.refreshToken,
            refreshTokenName: env.REFRESHTOKEN_NAME,
            cookieExpiration: setCookieExpiration(24),
        };
        // repository.authUser 호출할 때, 인자값 확인
        expect(usersService.usersRepository.authUser).toHaveBeenCalledWith(
            userBodyParams.nickname,
            logInUserHashValue
        );
        // usersService.createUser (===user)에서 호출되는 결과값이 Service의 return 값과 일치하는지 확인
        expect(logInUserToken).toEqual(logInUserTokenReturnValue);
    });

    // [logInUser-실패 케이스] Validation Error를 반환
    test('Users Service logInUser Method by undefined user', async () => {
        const undefinedNickname = 'undefined';
        try {
            usersService.usersRepository.authUser = jest.fn(() => null);

            await usersService.logInUser(
                undefinedNickname,
                userBodyParams.password
            );
        } catch (error) {
            expect(usersService.usersRepository.authUser).toHaveBeenCalledWith(
                undefinedNickname,
                logInUserHashValue
            );
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toEqual(
                '닉네임 또는 패스워드를 확인해주세요'
            );
            expect(error.status).toEqual(412);
        }
    });

    test('Users Service logInUser Method by wrong password', async () => {
        const wongPassword = '!!!InvalidPassword';
        try {
            usersService.usersRepository.authUser = jest.fn(() => null);

            await usersService.logInUser(userBodyParams.nickname, wongPassword);
        } catch (error) {
            expect(usersService.usersRepository.authUser).toHaveBeenCalledWith(
                userBodyParams.nickname,
                hash(wongPassword)
            );
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toEqual(
                '닉네임 또는 패스워드를 확인해주세요'
            );
            expect(error.status).toEqual(412);
        }
    });
});
