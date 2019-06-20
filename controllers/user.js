const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandlers');

exports.signup = (req, res) => {
  const user = new User(req.body);

  user.save((err, user) => {
    // handle error
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
