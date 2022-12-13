const { Op } = require('sequelize');

class UsersRepository {
    constructor(UsersModel) {
        this.usersModel = UsersModel;
    }

    findUser = async ({ nickname }) => {
        return await this.usersModel.findOne({
            where: { nickname },
            attributes: { exclude: ['password'] },
        });
    };

    authUser = async ({ nickname, password }) => {
        return await this.usersModel.findOne({
            where: {
                [Op.and]: [{ nickname }, { password }],
            },
            attributes: { exclude: ['password'] },
        });
    };

    createUser = async ({ nickname, password }) => {
        return await this.usersModel.create({
            nickname,
            password,
        });
    };
}

module.exports = UsersRepository;
