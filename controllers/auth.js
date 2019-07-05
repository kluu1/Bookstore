const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandlers');

exports.signup = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // clear salt and password
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({ user });
  } catch (err) {
    return res.status(400).json({ err: errorHandler(err) });
  }
};

exports.signin = async (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return new this.api.ApiResponse('User does not exist', {}, 400);
  }
  if (!user.authenticate(password)) {
    return res.status(401).json({ error: 'Email and password does not match' });
  }
  const { _id, name, role } = user;
  const token = jwt.sign({ _id }, process.env.JWT_SECRET);
  res.cookie('token', token, { expire: new Date() + 3600 }); // seconds
  return res.json({ token, user: { _id, email, name, role } });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Signed out successfully' });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
  const user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({ error: 'Access Denined' });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({ error: 'Access Denined! Admin Route!' });
  }
  next();
};
