const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.homePage = (req, res, next) => {
  res.status(200).render('index');
};

exports.ourClanPage = catchAsync(async (req, res, next) => {
  const superadmins = await User.find({ role: 'superadmin' });
  const admins = await User.find({ role: 'admin' });
  const members = await User.find({ role: 'member' });

  res.status(200).render('ourClan', { superadmins, admins, members });
});

exports.loginPage = (req, res, next) => {
  res.status(200).render('login');
};

exports.notFoundPage = (req, res, next) => {
  res.status(200).render('notFound');
};

exports.profilePage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).render('profilePage', { user });
});

exports.adminPage = catchAsync(async (req, res, next) => {
  const numAdmin = await User.find({
    role: 'admin'
  }).countDocuments();

  const numMember = await User.find({
    role: 'member'
  }).countDocuments();

  res.status(200).render('admin', {
    title: 'Admin Panel',
    numAdmin,
    numMember
  });
});

exports.createUser = (req, res, next) => {
  res.status(200).render('createUser', { title: 'Create new user' });
};

exports.clanmemberList = catchAsync(async (req, res, next) => {
  const members = await User.find({ role: 'member' });

  res
    .status(200)
    .render('clanmemberList', { title: 'Clanmember list', members });
});

exports.superadminList = catchAsync(async (req, res, next) => {
  const superadmins = await User.find({ role: 'superadmin' });

  res
    .status(200)
    .render('superadminList', { title: 'Superadmin list', superadmins });
});

exports.adminList = catchAsync(async (req, res, next) => {
  let admins;
  if (req.user.role === 'superadmin') {
    admins = await User.find({ role: 'admin' });
  } else if (req.user.role === 'admin') {
    admins = await User.find({ role: 'admin' }).select(
      '-username -plain_password'
    );
  }

  res.status(200).render('adminList', { title: 'Admin list', admins });
});

exports.editUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).render('editUser', { title: 'Edit user', user });
});
