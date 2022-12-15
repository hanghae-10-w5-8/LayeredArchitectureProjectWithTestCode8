const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;
const {
    tokenObject,
    createToken,
    setCookieExpiration,
} = require('../util/auth-jwtToken.util');
const { AuthenticationError } = require('../exceptions/index.exception');

const validateToken = function (tokenType, tokenValue) {
    try {
        if (tokenType !== 'Bearer') {
            throw new AuthenticationError(
                '전달된 쿠키에서 오류가 발생하였습니다.',
                403
            );
        }
        jwt.verify(tokenValue, env.TOKEN_SECRETE_KEY);
        return true;
    } catch (error) {
        return false;
    }
};

const getAccessTokenPayload = function (accessToken) {
    try {
        return jwt.verify(accessToken, env.TOKEN_SECRETE_KEY);
    } catch (error) {
        return null;
    }
};

// [auth-user.middleware] 유저 인증에 실패해도 에러를 반환하지 않음
module.exports = async (req, res, next) => {
    try {
        const accessToken = req.cookies[env.ACCESSTOKEN_NAME];
        const refreshToken = req.cookies[env.REFRESHTOKEN_NAME];

        // token이 만료되어도, cookie가 만료 전이면, 만료된 token이 존재함
        // token 자체가 없다는 것은, 완전히 재로그인이 필요한 상황
        // refreshToken 만료시간 === 쿠키만료시간 (24h)
        if (!accessToken || !refreshToken) {
            throw new AuthenticationError('로그인 후 이용 가능합니다.', 403);
        }

        const [accessTokenType, accessTokenValue] = accessToken.split(' ');
        const [refreshTokenType, refreshTokenValue] = refreshToken.split(' ');

        if (!validateToken(accessTokenType, accessTokenValue)) {
            if (!validateToken(refreshTokenType, refreshTokenValue))
                throw new AuthenticationError(
                    'Token이 모두 만료되었습니다. 로그인 후 이용 가능합니다.',
                    419
                );

            const accessTokenId = tokenObject[refreshTokenValue];

            if (!accessTokenId)
                throw new AuthenticationError(
                    'Refresh Token의 정보가 서버에 존재하지 않습니다.',
                    404
                );

            const newAccessToken = createToken(accessTokenId, '3h');
            res.cookie(env.ACCESSTOKEN_NAME, `Bearer ${newAccessToken}`, {
                expires: setCookieExpiration(24),
            });
            // !!! controller에서 값을 받을 때, 기존과 같이 user객체가 아닌 accessTokenId(숫자)가 반환됩니다. -> "userId = res.locals.user"로 받으세요 !!!
            res.locals.user = accessTokenId;
            next();
        }

        const { userId } = getAccessTokenPayload(accessTokenValue);

        // !!! controller에서 값을 받을 때, 기존과 같이 user객체가 아닌 accessTokenId(숫자)가 반환됩니다. -> "userId = res.locals.user"로 받으세요 !!!
        res.locals.user = userId;
        next();
    } catch (error) {
        res.locals.user = undefined;
        next();
    }
};
