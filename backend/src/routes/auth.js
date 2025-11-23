const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Register organisation and admin user
router.post('/register', register);

// Login
router.post('/login', login);

module.exports = router;