const bcrypt = require('bcryptjs');
const User = require('../Models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Noly access normal admin and members
exports.filterForNormalAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role === 'superadmin') return next();

  const admins = await User.find({ role: 'admin' }).select(
    '-plain_password -username'
  );
  const members = await User.find({ role: 'member' });

  res.status(200).json({
    status: 'success',
    result: {
      admins,
      members
    }
  });
});

// normal admin only edit specific field
exports.filterForAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role === 'superadmin') return next();

  const user = await User.findById(req.params.id);
  if (user.role === 'admin' || user.role === 'superadmin') {
    return next(new AppError('You do not have permission!', 401));
  }

  next();
});

// normal admin can only create clan member
exports.filterReqObject = (req, res, next) => {
  if (req.user.role === 'superadmin') return next();

  const { role } = req.body;
  if (role === 'superadmin' || role === 'admin') delete req.body.role;

  next();
};

// Get my profiles
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};

// Set user avatar url
exports.setUserAvatarUrl = (req, res, next) => {
  if (!req.file) return next();

  req.body.avatar = req.file.filename;
  next();
};

// Superadmin and admin can edit password member password
exports.editPassword = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    req.body.plain_password = req.body.password;

    req.body.password = await bcrypt.hash(req.body.password, 12);
    req.body.passwordChangeAt = Date.now() - 1000;
  }

  next();
});

/**
 * @desc    Get all user list
 * @route   GET /api/users
 * @access  Private(superadmin)
 */
exports.getAllUser = factory.getAll(User);

/**
 * @desc    Get single user
 * @route   GET /api/users/id
 * @access  Private(superadmin)
 */
exports.getUser = factory.getOne(User);

/**
 * @desc    Create new user
 * @route   POST /api/users
 * @access  Private(superadmin)
 */
exports.createUser = factory.createOne(User);

/**
 * @desc    Update a user
 * @route   PATCH /api/users/id
 * @access  Private(superadmin)
 */
exports.updateUser = factory.updateOne(User);

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/id
 * @access  Private(superadmin)
 */
exports.deleteUser = factory.deleteOne(User);

/**
 * @desc    Update my profile
 * @route   DELETE /api/users/update-me
 * @access  Private
 */
exports.updateMe = catchAsync(async (req, res, next) => {
  let filteredBody;
  if (req.user.role === 'superadmin' || req.user.role === 'admin') {
    if (req.body.password) {
      req.body.plain_password = req.body.password;

      req.body.password = await bcrypt.hash(req.body.password, 12);
      req.body.passwordChangeAt = Date.now() - 1000;
    }

    filteredBody = filterObj(
      req.body,
      'name',
      'username',
      'password',
      'plain_password',
      'passwordChangeAt',
      'avatar',
      'main_class',
      'focus',
      'player_type',
      'description',
      'steam_profile',
      'youtube_profile',
      'twitch_profile'
    );
  } else {
    filteredBody = filterObj(
      req.body,
      'name',
      'avatar',
      'main_class',
      'focus',
      'player_type',
      'description',
      'steam_profile',
      'youtube_profile',
      'twitch_profile'
    );
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    result: updatedUser
  });
});
