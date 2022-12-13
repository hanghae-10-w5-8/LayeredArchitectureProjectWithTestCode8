const UsersService = require('../services/users.service.js');
const { InvalidParamsError } = require('../exceptions/index.exception.js');
const usersService = new UsersService();
console.log(usersService.createUser);

class UsersController {
    #usersService = new UsersService();

    createUser = async (req, res, next) => {
        try {
            const { nickname, password, confirm } = req.body;
            console.log(req.body);

            if (!nickname || !password || !confirm) {
                throw new InvalidParamsError();
            }

            await this.#usersService.createUser({
                nickname,
                password,
                confirm,
            });

            res.status(201).json({ message: '회원 가입에 성공하였습니다.' });
        } catch (err) {
            next(err);
        }
    };

    logInUser = async (req, res, next) => {};
}

module.exports = UsersController;
