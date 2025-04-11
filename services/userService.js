const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const  User  = require('../models/userModel');
const  UserPassword  = require('../models/userPasswordModel');
const  UserRole  = require('../models/userRoleModel');
// Supponendo che tu abbia una connessione singleton
const DbConnection = require('../config/db');
const sequelize = new DbConnection().getSequelizeInstance();

const { Op } = require('sequelize'); // Importa Sequelize per le operazioni di confronto

class UserService {
  static instance = null;

  constructor() {
    if (UserService.instance) {
      return UserService.instance;
    }
    UserService.instance = this;
  }

  async getUsers() {
    return userRepository.findAll(); // Chiamata al repository per recuperare tutti gli utenti
  }

  async getUserById(id) {
    return userRepository.findById(id); // Chiamata al repository per recuperare un utente tramite ID
  }

  async createUser({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error('Tutti i campi sono obbligatori');
    }

   
    const passwordRegex = /^[a-zA-Z0-9.$*?!|/_]{8,20}$/i; // Regex per password: 8-20 caratteri, lettere, numeri e simboli speciali
    if (!passwordRegex.test(password)) {
      throw new Error('Password non valida');
    }

    const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;
    
    if (!usernameRegex.test(username)) {
      throw new Error('Username non valido');
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email)) {
      throw new Error('Email non valida');
    }

    const transaction = await sequelize.transaction();

    try {
      // Controllo unicità
      const exists = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }]
        },
        transaction
      });

      if (exists) {
        throw new Error('Username o email già esistenti');
      }

      // Crea utente
      const user = await User.create({ username, email }, { transaction });

      
      // Cripta password
      const passwordHash = await bcrypt.hash(password, 10);

      // Crea record UserPassword
      await UserPassword.create({
        userId: user.id,
        password: passwordHash
      }, { transaction });

      // Assegna ruolo default (es. 'USER')
      await UserRole.create({
        userId: user.id,
        roleId: 1 // Supponendo che 1 sia l'ID del ruolo 'USER'
      }, { transaction });

      await transaction.commit();

      return { success: true, userId: user.id };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateUser(id, data) {
    return userRepository.update(id, data); // Chiamata al repository per aggiornare l'utente
  }

  async deleteUser(id) {
    return userRepository.delete(id); // Chiamata al repository per eliminare l'utente
  }
}

module.exports = new UserService(); // Singleton
