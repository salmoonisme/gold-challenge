const { Users } = require("../models");
const Error = require("../helpers/error");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { default: jwtDecode } = require('jwt-decode')

class UserController {
  async get(req, res, next) {
    try {
      const data = await Users.findAll({});
      if (data.length < 1) {
        throw new Error(400, "There is no user yet")
    }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async register(req, res, next) {
    try {
      const { name, email, password, street, city } = req.body;
      const checkEmail = await Users.findOne({ where: { email } });
      if (checkEmail) {
        throw new Error(400, `Email ${email} is already registered`);
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const createUser = await Users.create({
        name,
        email,
        password: hashPassword,
        street,
        city,
      });
      res.status(200).json(createUser);
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const checkEmail = await Users.findOne({ where: { email } });
      if (!checkEmail) {
        throw new Error(400, `Email ${email} is not registered yet`);
      }
      const passwordLogin = await bcrypt.compare(password, checkEmail.password);
      if (!passwordLogin) {
        throw new Error(400, "Password is incorrect")
      }
      const token = jwt.sign({ id: checkEmail.id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
      res.status(200).json(token);

    } catch (error) {
      next(error);
    }
  }
  async update (req, res, next) {
    try {
      const { name, email, street, city } = req.body
      const { id } = req.params
      const searchID = await Users.findOne({
        where : {id : id}
      })
      if (!searchID) {
        throw new Error (400, `There is no user with ID ${id}`)
      }
      const updateUser = await Users.update({
        name: name,
        email: email,
        street: street,
        city: city
      }, { where : {id: id}} )
      res.status(200).json({
        message: "Successfully update user"
    });
    }
    catch (error) {
      next(error)
    }
  }
  async deleteByID(req, res, next) {
    try {
      const { id } = req.params;
      const deleteUser = await Users.destroy({ where: { id: id } });
      res.status(200).json({
        message: "Successfully delete user"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { UserController };
  