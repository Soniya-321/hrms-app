const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Organisation = require('./organisation');

const Team = sequelize.define('team', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define association
Team.belongsTo(Organisation, { foreignKey: 'organisation_id' });
Organisation.hasMany(Team, { foreignKey: 'organisation_id' });

module.exports = Team;