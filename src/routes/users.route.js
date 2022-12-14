const express = require('express');
const UsersController = require('../controllers/users.controller.js');
const UsersService = require('../services/users.service');
const authLogInUserMiddleware = require('../middlewares/auth-logInUser.middleware');
const authUserMiddleware = require('../middlewares/auth-user.middlesare');
const router = express.Router();
const usersController = new UsersController();

router.post('/signup', authLogInUserMiddleware, usersController.createUser);
router.post('/login', authLogInUserMiddleware, usersController.logInUser);

module.exports = router;
