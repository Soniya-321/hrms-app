const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all employees
router.get('/', getAllEmployees);

// Get employee by ID
router.get('/:id', getEmployeeById);

// Create new employee
router.post('/', createEmployee);

// Update employee
router.put('/:id', updateEmployee);

// Delete employee
router.delete('/:id', deleteEmployee);

module.exports = router;