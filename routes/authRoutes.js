const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register-admin', authController.registerSuperAdmin);

router.get('/logout', authController.protect, authController.logout);

module.exports = router;
