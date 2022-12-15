const supertest = require('supertest');
const app = require('../../src/app');
const { Users } = require('../../src/models');

// npm run test:integration -> test 환경에서 실행되는지 꼭 확인
console.log(process.env.NODE_ENV);

beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') await Users.destroy({ where: {} });
    else throw new Error('NODE_ENV가 설정되어 있지 않습니다.');
});

const requestBody = {
    nickname: 'testuser1',
    password: 'testPassowrd1',
    confirm: 'testPassowrd1',
};
const createUserReturnValueByController = {
    userId: 1,
    nickname: 'testuser1',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
};

describe('users Domain', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('POST localhost:3000/api/users/signup 최초 호출 시 User 생성', async () => {
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);
        const responseByJson = JSON.parse(response.text);

        expect(response.status).toEqual(201);
        expect(responseByJson).toMatchObject({
            message: '회원 가입에 성공하였습니다.',
        });
    });

    test('POST localhost:3000/api/users/signup db에 존재하는 nickname으로 호출 시 ValidationError 생성', async () => {
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);
        const responseByJson = JSON.parse(response.text);

        expect(response.status).toEqual(412);
        expect(responseByJson).toMatchObject({
            errorMessage: '중복된 닉네임입니다.',
        });
    });

    test('POST localhost:3000/api/users/signup password !== confirm ValidationError 생성', async () => {
        const requestBodyWithError = {
            nickname: 'testuser2',
            password: 'testPassowrd',
            confirm: 'testPassowrd1',
        };

        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBodyWithError);
        const responseByJson = JSON.parse(response.text);

        expect(response.status).toEqual(412);
        expect(responseByJson).toMatchObject({
            errorMessage: '패스워드가 일치하지 않습니다.',
        });
    });

    test('POST localhost:3000/api/users/signup ID형식 ValidationError 생성', async () => {
        const requestBodyWithError = {
            nickname: 'testuser1!!!',
            password: 'testPassowrd1',
            confirm: 'testPassowrd1',
        };

        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBodyWithError);
        const responseByJson = JSON.parse(response.text);

        expect(response.status).toEqual(412);
        expect(responseByJson).toMatchObject({
            errorMessage: 'ID 형식이 일치하지 않습니다.',
        });
    });

    test('POST localhost:3000/api/users/signup pw형식 ValidationError 생성', async () => {
        const requestBodyWithError = {
            nickname: 'testuser2',
            password: '@!!!testPassowrd1',
            confirm: '@!!!testPassowrd1',
        };

        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBodyWithError);
        const responseByJson = JSON.parse(response.text);

        expect(response.status).toEqual(412);
        expect(responseByJson).toMatchObject({
            errorMessage: '패스워드 형식이 일치하지 않습니다.',
        });
    });

    test('POST localhost:3000/api/users/signup pw에 nickname 포함 ValidationError 생성', async () => {
        const requestBodyWithError = {
            nickname: 'testuser2',
            password: '1123testuser2123',
            confirm: '1123testuser2123',
        };
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBodyWithError);
        const responseByJson = JSON.parse(response.text);
        expect(response.status).toEqual(412);
        expect(responseByJson).toMatchObject({
            errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
        });
    });

    test('POST localhost:3000/api/users/login 호출시 로그인 성공', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send(requestBody);
        const responseByJson = JSON.parse(response.text);
        const accessTokenType = responseByJson.accessToken.split('[')[0];
        expect(response.status).toEqual(200);
        expect(accessTokenType).toEqual('Bearer');
    });

    test('POST localhost:3000/api/users/login InvalidParamsError', async () => {
        const response = await supertest(app).post('/api/users/login').send({});
        const responseByJson = JSON.parse(response.text);
        expect(response.status).toEqual(400);
        expect(responseByJson).toMatchObject({
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
    });

    test('POST localhost:3000/api/users/login ValidationError', async () => {
        const response = await supertest(app).post('/api/users/login').send({
            nickname: requestBody.nickname,
            password: 'invalidPassword',
        });
        const responseByJson = JSON.parse(response.text);
        expect(response.status).toEqual(412);
        expect(responseByJson).toMatchObject({
            errorMessage: '닉네임 또는 패스워드를 확인해주세요',
        });
    });
});
