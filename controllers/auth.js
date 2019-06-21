const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandlers');

exports.signup = (req, res) => {
  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }
    // clear salt and password
    user.salt = undefined;
    user.hashed_password = undefined;

    // return user
    res.json({ user });
  });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    const { _id, name, email, role } = user;

    if (err || !user) {
      return res.status(400).json({
        err: 'User with that email does not exist'
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password does not match'
      });
    }

    // generate a signed token and return to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token, { expire: new Date() + 3600 }); // seconds
    return res.json({ token, user: { _id, email, name, role } });
  });
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
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access Denined'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access Denined'
    });
  }
  next();
};
