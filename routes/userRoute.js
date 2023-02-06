const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers/userController");
const userController = new UserController();
const registerValidator = require("../helpers/register");
const loginValidator = require("../helpers/login");
const validation = require ("../middlewares/validation")

//   router.get("/user", userController.getUser)
router.get("/user", userController.get);
router.post("/register", validation(registerValidator), userController.register);
router.post("/login", validation(loginValidator), userController.login);
router.patch("/user/:id", userController.update);
router.delete("/user/:id", userController.deleteByID);

module.exports = router;
