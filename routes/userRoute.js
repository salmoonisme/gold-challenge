const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers/userController');
const userController = new UserController();
const { registerValidator, loginValidator } = require('../helpers/validator');
const authentication = require('../middlewares/authentication');
const validation = require ('../middlewares/validation')

//   router.get('/user', userController.getUser)
router.get('/user', userController.get);
router.post('/register', validation(registerValidator), userController.register);
router.post('/login', validation(loginValidator), userController.login);
router.patch('/user', authentication, userController.update);
router.delete('/user', authentication, userController.deleteByID);

module.exports = router;
