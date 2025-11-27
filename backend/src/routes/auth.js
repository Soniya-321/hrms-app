const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Import your auth middleware

const router = express.Router();

// Register organisation and admin user
router.post('/register', register);

// Login
router.post('/login', login);

// Logout (requires authentication)
router.post('/logout', authMiddleware, logout);

module.exports = router;