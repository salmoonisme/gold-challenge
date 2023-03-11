const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers/userController');
const userController = new UserController();
const { registerValidator, loginValidator } = require('../helpers/validator');
const authentication = require('../middlewares/authentication');
const validation = require ('../middlewares/validation');
const { upload } = require('../middlewares/media');

//   router.get('/user', userController.getUser)
router.get('/user', userController.get);
router.post('/register/super', userController.registerAdmin);
router.post('/register', validation(registerValidator), authentication, userController.register);
router.put('/:id', upload.single('avatar'), userController.updateAvatar)
router.post('/login', validation(loginValidator), userController.login);
router.patch('/user', authentication, userController.update);

router.delete('/user', authentication, userController.deleteByID);

module.exports = router;
