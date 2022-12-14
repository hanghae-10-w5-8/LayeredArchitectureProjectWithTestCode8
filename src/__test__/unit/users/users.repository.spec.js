const UsersRepository = require('../../../repositories/users.repository.js');
const { Op } = require('sequelize');

const mockUsersModel = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
});

describe('Users Repository Layer Test', () => {
    let usersRepository = new UsersRepository(mockUsersModel);

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Users Repository findUser Method by Success', async () => {
        const findUserBodyParams = 'nickname1';
        const findUserReturnValue = {
            nickname: 'nickname1',
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
        };
        mockUsersModel.findOne = jest.fn(() => {
            return findUserReturnValue;
        });

        const findUserByNickname = await usersRepository.findUser(
            findUserBodyParams
        );

        // 1. findOne method가 1번 호출
        expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);

        // 2. mockUsersModel.findOnce이 호출 될 때, parameter로 findUserBodyParams를 받아 호출 됐는지?
        expect(mockUsersModel.findOne).toHaveBeenCalledWith({
            where: { nickname: findUserBodyParams },
            attributes: { exclude: ['password'] },
        });

        // 3. findUserByNickname이 findUserReturnValue 형태로 정상 반환?
        expect(findUserByNickname).toEqual(findUserReturnValue);
    });

    test('Users Repository findUser Method by No Such User', async () => {
        const findUserBodyParams = 'noname';
        const findUserReturnValue = null;
        mockUsersModel.findOne = jest.fn(() => {
            return findUserReturnValue;
        });

        const findUserByNickname = await usersRepository.findUser(
            findUserBodyParams
        );

        // 1. findOne method가 1번 호출
        expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);

        // 2. mockUsersModel.findOce이 호출 될 때, parameter로 findUserBodyParams를 받아 호출 됐는지?
        expect(mockUsersModel.findOne).toHaveBeenCalledWith({
            where: { nickname: findUserBodyParams },
            attributes: { exclude: ['password'] },
        });

        // 3. findUserByNickname이 findUserReturnValue 형태로 정상 반환?
        expect(findUserByNickname).toEqual(findUserReturnValue);
    });

    test('Users Repository authUser Method by Success', async () => {
        const authUserBodyParams = {
            nickname: 'nickname1',
            password: 'password1Sha256HashedValue',
        };
        mockUsersModel.findOne = jest.fn(() => {
            return 'authentication success';
        });

        const authUser = await usersRepository.authUser(
            authUserBodyParams.nickname,
            authUserBodyParams.password
        );

        // 1. findOne method가 1번 호출
        expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);

        // 2. mockUsersModel.findOne이 호출 될 때, parameter로 findUserBodyParams를 받아 호출 됐는지?
        expect(mockUsersModel.findOne).toHaveBeenCalledWith({
            where: {
                [Op.and]: [
                    { nickname: authUserBodyParams.nickname },
                    { password: authUserBodyParams.password },
                ],
            },
            attributes: { exclude: ['password'] },
        });

        // 3. findUserByNickname이 findUserReturnValue 형태로 정상 반환?
        expect(authUser).toEqual('authentication success');
    });

    test('Users Repository authUser Method by Wrong Info', async () => {
        const authUserBodyParams = {
            nickname: 'NoSuchUser',
            password: 'WrongPassword1Sha256HashedValue',
        };
        mockUsersModel.findOne = jest.fn(() => {
            return 'authentication failed';
        });

        const authUser = await usersRepository.authUser(
            authUserBodyParams.nickname,
            authUserBodyParams.password
        );

        // 1. findOne method가 1번 호출
        expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);

        // 2. mockUsersModel.findOne이 호출 될 때, parameter로 findUserBodyParams를 받아 호출 됐는지?
        expect(mockUsersModel.findOne).toHaveBeenCalledWith({
            where: {
                [Op.and]: [
                    { nickname: authUserBodyParams.nickname },
                    { password: authUserBodyParams.password },
                ],
            },
            attributes: { exclude: ['password'] },
        });

        // 3. findUserByNickname이 jest.fn() return 값과 같은지?
        expect(authUser).toEqual('authentication failed');
    });

    test('Users Repository createUser Method by Success', async () => {
        const createUserBodyParams = {
            nickname: 'nickname1',
            password: 'password1',
        };

        mockUsersModel.create = jest.fn(() => {
            return 'create user success';
        });

        const createNewUser = await usersRepository.createUser(
            createUserBodyParams.nickname,
            createUserBodyParams.password
        );

        // 1. create method가 1번 호출
        expect(mockUsersModel.create).toHaveBeenCalledTimes(1);

        // 2. mockUsersModel.create이 호출 될 때, parameter로 createUserBodyParams를 받아 호출 됐는지?
        expect(mockUsersModel.create).toHaveBeenCalledWith(
            createUserBodyParams
        );

        // 3. createNewUser가 findUserReturnValue 형태로 정상 반환?
        expect(createNewUser).toEqual('create user success');
    });

    // mockUsersModel.create method에서 실패할 수 있는 상황이 있나??
});
