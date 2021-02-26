const express = require('express');
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.get('/login', viewController.loginPage);
router.get('/notFound', viewController.notFoundPage);
router.get('/our-clan', viewController.ourClanPage);
router.get('/', viewController.homePage);

router.use(authController.isLoggedIn);

router.get('/profile', viewController.profilePage);

router.use(authController.viewResticTo('superadmin', 'admin'));

router.get('/admin', viewController.adminPage);
router.get('/admin/users/create', viewController.createUser);
router.get('/admin/users/members', viewController.clanmemberList);
router.get(
  '/admin/users/superadmins',
  authController.viewResticTo('superadmin'),
  viewController.superadminList
);
router.get('/admin/users/admins', viewController.adminList);

router.get('/admin/users/edit/:id', viewController.editUser);

module.exports = router;
