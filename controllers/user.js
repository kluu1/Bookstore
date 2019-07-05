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

exports.getUser = (req, res) => {
  // make sure password is cleared
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true });
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: 'You are not authorized to perform this action' });
  }
};
