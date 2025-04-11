// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const DbConnection = require('../config/db');
const sequelize = new DbConnection().getConnection();

const { UserRole } = require('./userRoleModel');
const { UserPassword } = require('./userPasswordModel');
const { User } = require('./userModel');


const defineUser = require('./userModel');
const defineUserPassword = require('./userPasswordModel');
const defineUserRole = require('./userRoleModel');

const User = defineUser(sequelize, DataTypes);
const UserPassword = defineUserPassword(sequelize, DataTypes);
const UserRole = defineUserRole(sequelize, DataTypes);

// Associazioni
User.associate?.({ UserPassword, UserRole });

module.exports = {
  sequelize,
  User,
  UserPassword,
  UserRole,
};
