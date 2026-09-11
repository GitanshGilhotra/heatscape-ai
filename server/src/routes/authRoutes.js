const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/guest', authController.guestLogin);
router.get('/me', authController.getMe);

module.exports = router;
