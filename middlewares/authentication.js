const { verifyToken } = require('../helpers/jwt');
const { Users } = require('../models');
const Error = require('../helpers/error');

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      throw new Error(401, 'Invalid token');
    }
    const decodedToken = verifyToken(token);
    const user = await Users.findByPk(decodedToken.id);
    if (!user || decodedToken.id !== user.id) {
      throw new Error(401, 'Unauthenticated');
    }
    if (decodedToken.role !== 'superadmin') {
      throw new Error(401, 'Only superadmin eligible')
    }
    req.user = {
      id: user.id,
      email: user.email,
    };
    next();
  } catch (error) { 
    next(error);
  }
};

module.exports = authentication;
