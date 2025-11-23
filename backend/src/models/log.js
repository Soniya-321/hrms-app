const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Organisation = require('./organisation');
const User = require('./user');

const Log = sequelize.define('log', {
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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define associations
Log.belongsTo(Organisation, { foreignKey: 'organisation_id' });
Log.belongsTo(User, { foreignKey: 'user_id' });
Organisation.hasMany(Log, { foreignKey: 'organisation_id' });
User.hasMany(Log, { foreignKey: 'user_id' });

module.exports = Log;