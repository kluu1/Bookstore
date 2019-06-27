const User = require('../models/user');

exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec();
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'User not found' });
  }
};
