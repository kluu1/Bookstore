exports.userSignupValidator = (req, res, next) => {
  req.check('name', 'Name is required').notEmpty();

  req
    .check('email', 'Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must conatin @')
    .isLength({
      min: 4,
      max: 32
    });

  req.check('password', 'Password is required').notEmpty();

  req
    .check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must container a number');

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(err => err.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};
