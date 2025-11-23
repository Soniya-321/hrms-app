const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployeeToTeam,
  removeEmployeeFromTeam,
} = require('../controllers/teamController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all teams
router.get('/', getAllTeams);

// Get team by ID
router.get('/:id', getTeamById);

// Create new team
router.post('/', createTeam);

// Update team
router.put('/:id', updateTeam);

// Delete team
router.delete('/:id', deleteTeam);

// Assign employee to team
router.post('/assign', assignEmployeeToTeam);

// Remove employee from team
router.post('/remove', removeEmployeeFromTeam);

module.exports = router;