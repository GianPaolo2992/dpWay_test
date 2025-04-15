
const UserRole = require('../models/userRoleModel');


class UserRoleRepository {
    static instance = null;

    constructor(){
        if(UserRoleRepository.instance){
            return UserRoleRepository.instance;
        }
        UserRoleRepository.instance = this;
    }

    async create(userId, roleId, transaction) {
        return UserRole.create({ user_id: userId, role_id: roleId }, { transaction });
      }

      async findByUserId(userId) {
        return UserRole.findByPk(userId);}

        async deleteByUserId(userId, options) {
            return await UserRole.destroy({
              where: { user_id: userId },
              ...options,
            });
          }

}

   


module.exports = new UserRoleRepository();