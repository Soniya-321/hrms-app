const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Organisation = require('./organisation');

const Employee = sequelize.define('employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organisation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Organisation,
      key: 'id',
    },
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define association
Employee.belongsTo(Organisation, { foreignKey: 'organisation_id' });
Organisation.hasMany(Employee, { foreignKey: 'organisation_id' });

module.exports = Employee;