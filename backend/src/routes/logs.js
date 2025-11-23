const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { Log } = require('../models');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all logs for the organisation
router.get('/', async (req, res) => {
  try {
    const logs = await Log.findAll({
      where: { organisation_id: req.user.organisationId },
      include: [
        {
          model: require('../models').User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['timestamp', 'DESC']],
    });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;