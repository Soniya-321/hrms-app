const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Organisation = require('./organisation');

const User = sequelize.define('user', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define association
User.belongsTo(Organisation, { foreignKey: 'organisation_id' });
Organisation.hasMany(User, { foreignKey: 'organisation_id' });

module.exports = User;