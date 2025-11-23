const { Team, Employee, EmployeeTeam, Log } = require('../models');

// Get all teams for the organisation
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { organisation_id: req.user.organisationId },
      include: [
        {
          model: Employee,
          through: { attributes: [] },
        },
      ],
    });

    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get team by ID
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: {
        id,
        organisation_id: req.user.organisationId,
      },
      include: [
        {
          model: Employee,
          through: { attributes: [] },
        },
      ],
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new team
const createTeam = async (req, res) => {
  try {
    const { name, description, employeeIds } = req.body;

    const team = await Team.create({
      organisation_id: req.user.organisationId,
      name,
      description,
    });

    // Assign employees if provided
    if (employeeIds && employeeIds.length > 0) {
      const employees = await Employee.findAll({
        where: {
          id: employeeIds,
          organisation_id: req.user.organisationId,
        },
      });

      await team.setEmployees(employees);
    }

    // Log action
    await Log.create({
      organisation_id: req.user.organisationId,
      user_id: req.user.userId,
      action: 'team_created',
      meta: { teamId: team.id, name },
    });

    // Return team with employees
    const teamWithEmployees = await Team.findByPk(team.id, {
      include: [
        {
          model: Employee,
          through: { attributes: [] },
        },
      ],
    });

    res.status(201).json(teamWithEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update team
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, employeeIds } = req.body;

    const team = await Team.findOne({
      where: {
        id,
        organisation_id: req.user.organisationId,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Update team details
    await team.update({
      name,
      description,
    });

    // Update employee assignments if provided
    if (employeeIds !== undefined) {
      if (employeeIds.length > 0) {
        const employees = await Employee.findAll({
          where: {
            id: employeeIds,
            organisation_id: req.user.organisationId,
          },
        });

        await team.setEmployees(employees);
      } else {
        // Remove all employee assignments
        await team.setEmployees([]);
      }
    }

    // Log action
    await Log.create({
      organisation_id: req.user.organisationId,
      user_id: req.user.userId,
      action: 'team_updated',
      meta: { teamId: team.id, name },
    });

    // Return updated team with employees
    const updatedTeam = await Team.findByPk(team.id, {
      include: [
        {
          model: Employee,
          through: { attributes: [] },
        },
      ],
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete team
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: {
        id,
        organisation_id: req.user.organisationId,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.destroy();

    // Log action
    await Log.create({
      organisation_id: req.user.organisationId,
      user_id: req.user.userId,
      action: 'team_deleted',
      meta: { teamId: id },
    });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign employee to team
const assignEmployeeToTeam = async (req, res) => {
  try {
    const { teamId, employeeId } = req.body;

    // Check if team exists and belongs to organisation
    const team = await Team.findOne({
      where: {
        id: teamId,
        organisation_id: req.user.organisationId,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if employee exists and belongs to organisation
    const employee = await Employee.findOne({
      where: {
        id: employeeId,
        organisation_id: req.user.organisationId,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if assignment already exists
    const existingAssignment = await EmployeeTeam.findOne({
      where: {
        employee_id: employeeId,
        team_id: teamId,
      },
    });

    if (existingAssignment) {
      return res.status(400).json({ message: 'Employee already assigned to this team' });
    }

    // Create assignment
    await EmployeeTeam.create({
      employee_id: employeeId,
      team_id: teamId,
    });

    // Log action
    await Log.create({
      organisation_id: req.user.organisationId,
      user_id: req.user.userId,
      action: 'employee_assigned_to_team',
      meta: { employeeId, teamId },
    });

    res.json({ message: 'Employee assigned to team successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove employee from team
const removeEmployeeFromTeam = async (req, res) => {
  try {
    const { teamId, employeeId } = req.body;

    // Check if assignment exists
    const assignment = await EmployeeTeam.findOne({
      where: {
        employee_id: employeeId,
        team_id: teamId,
      },
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify team belongs to organisation
    const team = await Team.findOne({
      where: {
        id: teamId,
        organisation_id: req.user.organisationId,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Delete assignment
    await assignment.destroy();

    // Log action
    await Log.create({
      organisation_id: req.user.organisationId,
      user_id: req.user.userId,
      action: 'employee_removed_from_team',
      meta: { employeeId, teamId },
    });

    res.json({ message: 'Employee removed from team successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployeeToTeam,
  removeEmployeeFromTeam,
};