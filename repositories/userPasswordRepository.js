
const UserPassword = require('../models/userPasswordModel'); // Modifica l'importazione per prendere l'oggetto 'UserPassword' da models/index.js

class UserPasswordRepository {
    static instance = null;

    constructor(){
        if(UserPasswordRepository.instance){
            return UserPasswordRepository.instance;
        }
        UserPasswordRepository.instance = this;
    }
    

  async create(userId, passwordHash,transaction) {
    return UserPassword.create({ user_id: userId, password: passwordHash }, { transaction });
  }

  async findAll({ where }) {
    return UserPassword.findAll({ where });
  }

  async findOne({ where }) {
    return UserPassword.findOne({ where });
  }

  
  async deleteByUserId(userId, options) {
    return await UserPassword.destroy({
      where: { user_id: userId },
      ...options,
    });
  }
  
}

module.exports = new UserPasswordRepository();