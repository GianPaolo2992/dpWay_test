const User = require('../models/userModel');  // Modifica l'importazione per prendere l'oggetto 'User' da models/index.js
const Role = require('../models/roleModel'); // Importa il modello Role

class UserRepository {
  static instance = null;

  constructor() {
    if (UserRepository.instance) {
      return UserRepository.instance;
    }
    UserRepository.instance = this;
  }

  async findAll() {
    return User.findAll(); // Trova tutti gli utenti
  }
  async findAllWithRole() {
    return User.findAll({
      include: [
        {
          model: Role,
          as: 'roles', // Usa l'alias definito nell'associazione
          attributes: ['id', 'name'], // Specifica i campi che vuoi ottenere dal modello Role
          through: { attributes: [] }, // Escludi i campi intermedi della tabella user_role
        },
      ],
    });
  }

  async findById(id) {
    return User.findByPk(id);  // Modifica per usare findByPk al posto di findById
  }
  async findOne(condition, transaction) {
    return User.findOne({ where: condition, transaction });
  }

  async create({ username, email }, { transaction }) {
    return User.create({ username, email }, { transaction });  // Crea un nuovo utente
  }

  async update(id, data, transaction) {
    return await User.update(data, {
      where: { id }, // Condizione per identificare il record da aggiornare
      transaction,   // Passa la transazione
    });
  }

  async delete(id, options) {
     // Trova l'utente per id
   return await User.destroy({
    where: { id: id },
    ...options,
  });
  }
}

module.exports = new UserRepository(); // Singleton
