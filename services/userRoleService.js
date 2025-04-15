const userRoleRepository = require('../repositories/userRoleRepository');

class UserRoleService {
  async assignDefaultRole(userId, transaction) {
    const defaultRoleId = 2; // Supponendo che 2 sia l'ID del ruolo predefinito(USER)
    return userRoleRepository.create(userId, defaultRoleId, transaction);
  }
}

module.exports = new UserRoleService();