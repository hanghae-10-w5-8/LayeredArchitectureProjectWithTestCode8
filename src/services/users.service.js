require('dotenv').config();
const jwt = require('jsonwebtoken');
const UsersRepository = require('../repositories/users.repository.js');
const { Users } = require('../models');
const { ValidationError } = require('../exceptions/index.exception.js');
const { hash } = require('../util/auth-encryption.util');
const {
    tokenObject,
    createToken,
    setCookieExpiration,
} = require('../util/auth-jwtToken.util');
const env = process.env;

class UsersService {
    #usersRepository = new UsersRepository(Users);

    findUser = async ({ nickname }) => {
        const user = await this.#usersRepository.findUser({
            nickname,
        });

        return user;
    };

    createUser = async ({ nickname, password, confirm }) => {
        const re_nickname = /^[a-zA-Z0-9]{3,10}$/;
        const re_password = /^[a-zA-Z0-9]{4,30}$/;
        function isRegexValidation(target, regex) {
            return target.search(regex) !== -1;
        }

        const isExistUser = await this.findUser({ nickname });

        if (isExistUser.nickname === nickname) {
            throw new ValidationError('중복된 닉네임입니다.', 412);
        } else if (password !== confirm) {
            throw new ValidationError('패스워드가 일치하지 않습니다.', 412);
        } else if (nickname.search(re_nickname) === -1) {
            throw new ValidationError('ID 형식이 일치하지 않습니다.', 412);
        } else if (password.search(re_password) === -1) {
            throw new ValidationError(
                '패스워드 형식이 일치하지 않습니다.',
                412
            );
        } else if (isRegexValidation(password, nickname)) {
            throw new ValidationError(
                '패스워드에 닉네임이 포함되어 있습니다.',
                412
            );
        }

        const hashValue = hash(password);

        const user = await this.#usersRepository.createUser({
            nickname,
            password: hashValue,
        });

        return user;
    };

    logInUser = async ({ nickname, password }) => {
        const hashValue = hash(password);
        const user = await this.#usersRepository.authUser({
            nickname,
            password: hashValue,
        });

        if (user === null || !user) {
            throw new ValidationError(
                '닉네임 또는 패스워드를 확인해주세요',
                412
            );
        }

        const accessToken = createToken(user.userId, '3h');
        const refreshToken = createToken('refreshToken', '1d');
        tokenObject[refreshToken] = user.userId;

        const tokens = {
            accessToken,
            accessTokenName: env.ACCESSTOKEN_NAME,
            refreshToken,
            refreshTokenName: env.REFRESHTOKEN_NAME,
            cookieExpiration: setCookieExpiration(24),
        };
        return tokens;
    };
}

module.exports = UsersService;
