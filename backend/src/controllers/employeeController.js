const { Employee, Team, EmployeeTeam, Log } = require('../models');

// Get all employees for the organisation
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { organisation_id: req.user.organisationId },
      include: [
        {
          model: Team,
          through: { attributes: [] },
        },
      ],
    });

    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: {
        id,
        organisation_id: req.user.organisationId,
      },
      include: [
        {
          model: Team,
          through: { attributes: [] },
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, teamIds } = req.body;

    const employee = await Employee.create({
      organisation_id: req.user.organisationId,
      first_name,
      last_name,
      email,
      phone,
    });

    // Assign to teams if provided
    if (teamIds && teamIds.length > 0) {
      const teams = await Team.findAll({
        where: {
          id: teamIds,
          organisation_id: req.user.organisationId,
        },
      });

      await employee.setTeams(teams);
    }

    // Log action
    await Log.create({
      organisation_id: req.user.organisationId,
      user_id: req.user.userId,
      action: 'employee_created',
      meta: { employeeId: employee.id, first_name, last_name },
    });

    // Return employee with teams
    const employeeWithTeams = await Employee.findByPk(employee.id, {
      include: [
        {
          model: Team,
          through: { attributes: [] },
        },
      ],
    });

    res.status(201).json(employeeWithTeams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, teamIds } = req.body;

    const employee = await Employee.findOne({
      where: {
        id,
        organisation_id: req.user.organisationId,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee details
    await employee.update({
      first_name,
      last_name,
      email,
      phone,
    });

    // Update team assignments if provided
    if (teamIds !== undefined) {
      if (teamIds.length > 0) {
        const teams = await Team.findAll({
          where: {
            id: teamIds,
            organisation_id: req.user.organisationId,
          },
        });

        await employee.setTeams(teams);
      } else {
        // Remove all team assignments
        await employee.setTeams([]);
      }
    }

    // Log action
    await Log.create({
      organisation_id: req.user.organisationId,
      user_id: req.user.userId,
      action: 'employee_updated',
      meta: { employeeId: employee.id, first_name, last_name },
    });

    // Return updated employee with teams
    const updatedEmployee = await Employee.findByPk(employee.id, {
      include: [
        {
          model: Team,
          through: { attributes: [] },
        },
      ],
    });

    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: {
        id,
        organisation_id: req.user.organisationId,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.destroy();

    // Log action
    await Log.create({
      organisation_id: req.user.organisationId,
      user_id: req.user.userId,
      action: 'employee_deleted',
      meta: { employeeId: id },
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};