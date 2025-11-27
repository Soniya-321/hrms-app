const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../models');

// Register a new organisation and admin user
const register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create organisation
    const organisation = await Organisation.create({ name: orgName });

    // Create admin user
    const user = await User.create({
      organisation_id: organisation.id,
      email,
      password_hash: passwordHash,
      name: adminName,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, organisationId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Log action
    await Log.create({
      organisation_id: organisation.id,
      user_id: user.id,
      action: 'user_registered',
      meta: { organisationId: organisation.id, userId: user.id },
    });

    res.status(201).json({
      message: 'Organisation and admin user created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organisationId: organisation.id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, organisationId: user.organisation_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Log action
    await Log.create({
      organisation_id: user.organisation_id,
      user_id: user.id,
      action: 'user_logged_in',
      meta: { userId: user.id },
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organisationId: user.organisation_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout user
const logout = async (req, res) => {
    try {
      // Assumes 'authMiddleware' is used on this route to populate req.user
      const { userId, organisationId } = req.user;
      console.log("logged out user", userId, organisationId);
  
      // Log action
      await Log.create({
        organisation_id: organisationId,
        user_id: userId,
        action: 'user_logged_out',
        meta: { userId: userId },
      });
  
      res.json({ message: 'Logout successful' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during logout' });
    }
};

module.exports = { register, login, logout };
