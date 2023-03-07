const { Users } = require('../models');
const Error = require('../helpers/error');
const Response = require('../helpers/response');
const { getToken } = require('../helpers/jwt')
const bcrypt = require('bcryptjs');
// const authentication = require('../middlewares/authentication');

class UserController {
  async get(req, res, next) {
    try {
      const data = await Users.findAll({});
      if (data.length < 1) {
        throw new Error(400, 'There is no user yet');
      }
        return new Response(res, 200, data);
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
      return new Response(res, 200, createUser);
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
        throw new Error(400, 'Password is incorrect');
      }
      const payload = {
        id: checkEmail.id
      }
      const token = getToken(payload);
      return new Response(res, 200, token);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { name, email, street, city } = req.body;
      const { id } = req.user;
      const searchID = await Users.findOne({
        where: { id: id },
      });
      if (!searchID) {
        throw new Error(400, `There is no user with ID ${id}`);
      }
      const updateUser = await Users.update(
        {
          name: name,
          email: email,
          street: street,
          city: city,
        },
        { where: { id: id } }
      );
      const newUser = await Users.findOne({
        where: { id: id },
      });
      return new Response(res, 200, newUser);
    } catch (error) {
      next(error);
    }
  }
  async deleteByID(req, res, next) {
    try {
      const { id } = req.user;
      const deleteUser = await Users.destroy({ where: { id: id } });
      return new Response(res, 200, 'User has been deleted');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { UserController };
