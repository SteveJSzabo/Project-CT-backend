const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// send JWT token to the client
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // set token as a cookie
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from response output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    result: {
      token,
      role: user.role
    }
  });
};

/**
 * @desc    Register a new superadmin
 * @route   POST /api/auth/register-admin
 * @access  Public
 */
exports.registerSuperAdmin = catchAsync(async (req, res, next) => {
  // Assign as the superadmin
  req.body.role = 'superadmin';

  const newSuperAdmin = await User.create(req.body);

  createSendToken(newSuperAdmin, 201, req, res);
});

/**
 * @desc    Login a User
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);

  // 1) Check if username and password exist
  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

/**
 * @desc Logout
 * @route GET /api/auth/logout
 * @access  Private(only logged in user)
 */
exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggoutcookie', {
    expires: new Date(Date.now() + 10),
    httpOnly: true
  });

  res.status(200).json({ status: 'success' });
};

// Check if user is authenticated or not
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.passwordChangeAfter(decoded.iat)) {
    return next(
      new AppError('Your password recently changed! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;

  next();
});

// Restic the route access
exports.resticTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

//Only for renderd webpage
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.render('login');
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.passwordChangeAfter(decoded.iat)) {
        return res.render('login');
      }

      // THERE IS A LOGGED IN USER
      req.user = currentUser;
      res.locals.authUser = currentUser;
      return next();
    } catch (err) {
      return res.render('login');
    }
  } else {
    res.render('login');
  }
};

exports.viewResticTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.redirect('/');
    }
    next();
  };
};
