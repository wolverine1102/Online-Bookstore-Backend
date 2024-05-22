const User = require('../models/user');

const isAdmin = async function (req, res, next) {
    const user = await User.findById(req.userId);

    if (user.role !== 'admin') {
      return res.status(403).send('Access denied.');
    }
    next();
  };

module.exports = {
  isAdmin
};