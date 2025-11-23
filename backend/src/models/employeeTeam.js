const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Employee = require('./employee');
const Team = require('./team');

const EmployeeTeam = sequelize.define('employee_team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: 'id',
    },
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Team,
      key: 'id',
    },
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define many-to-many association
Employee.belongsToMany(Team, { through: EmployeeTeam, foreignKey: 'employee_id' });
Team.belongsToMany(Employee, { through: EmployeeTeam, foreignKey: 'team_id' });

module.exports = EmployeeTeam;