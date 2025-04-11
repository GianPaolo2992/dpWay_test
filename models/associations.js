const User = require('./userModel');
const Role = require('./roleModel');
const UserRole = require('./userRoleModel');
const UserPassword = require('./userPasswordModel');
const Blacklist = require('./blacklistModel');

// Relazione molti-a-molti tra User e Role tramite UserRole
User.belongsToMany(Role, { through: 'user_role', foreignKey: 'user_id', otherKey: 'role_id', as: 'roles' });
Role.belongsToMany(User, { through: 'user_role', foreignKey: 'role_id', otherKey: 'user_id', as: 'users' });

// Relazione uno-a-molti tra User e UserPassword
User.hasMany(UserPassword, { foreignKey: 'user_id' });
UserPassword.belongsTo(User, { foreignKey: 'user_id' });

// Relazione uno-a-uno tra User e Blacklist
User.hasOne(Blacklist, { foreignKey: 'user_id' });
Blacklist.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  Role,
  UserRole,
  UserPassword,
  Blacklist
};
