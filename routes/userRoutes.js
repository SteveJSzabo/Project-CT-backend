const express = require('express');
const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');
const imageUpload = require('../middlewares/imageUpload');

const router = express.Router();

router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/update-me',
  imageUpload.uploadUserAvatar,
  imageUpload.resizeUserAvatar,
  userController.setUserAvatarUrl,
  userController.updateMe
);

router.use(authController.resticTo('superadmin', 'admin'));

router
  .route('/')
  .get(userController.filterForNormalAdmin, userController.getAllUser)
  .post(
    userController.filterReqObject,
    imageUpload.uploadUserAvatar,
    imageUpload.resizeUserAvatar,
    userController.setUserAvatarUrl,
    userController.createUser
  );

router
  .route('/:id')
  .get(userController.filterForAdmin, userController.getUser)
  .patch(
    userController.filterForAdmin,
    userController.filterReqObject,
    imageUpload.uploadUserAvatar,
    imageUpload.resizeUserAvatar,
    userController.setUserAvatarUrl,
    userController.editPassword,
    userController.updateUser
  )
  .delete(userController.filterForAdmin, userController.deleteUser);

module.exports = router;
