const User = require('../models/userModel');  // Modifica l'importazione per prendere l'oggetto 'User' da models/index.js

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

  async findById(id) {
    return User.findByPk(id);  // Modifica per usare findByPk al posto di findById
  }

  async create(data) {
    return User.create(data);  // Crea un nuovo utente
  }

  async update(id, data) {
    const user = await User.findByPk(id); // Trova l'utente per id
    if (user) return user.update(data);  // Se l'utente esiste, aggiorna
    return null;
  }

  async delete(id) {
    const user = await User.findByPk(id); // Trova l'utente per id
    if (user) return user.destroy();  // Se l'utente esiste, distruggi il record
    return null;
  }
}

module.exports = new UserRepository(); // Singleton
