const DbConnection = require("../config/db");
const sequelize = new DbConnection().getSequelizeInstance();
const { Op } = require("sequelize"); // Importa Sequelize per le operazioni di confronto

const userRepository = require("../repositories/userRepository");

const userRoleService = require("./userRoleService");
const userPasswordService = require("./userPasswordService");

const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const userRoleRepository = require('../repositories/userRoleRepository');
const userPasswordRepository = require("../repositories/userPasswordRepository");

// Supponendo che tu abbia una connessione singleton

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

  async getUsersWithRole(){

    return userRepository.findAllWithRole();
  }

  async getUserById(id) {
    return userRepository.findById(id); // Chiamata al repository per recuperare un utente tramite ID
  }
  static validationUsername( username){
  // Regex per validare username: 4-20 caratteri, lettere, numeri e simboli speciali
  const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;

  if (!usernameRegex.test(username)) {
    throw new Error("Username non valido");
  }
}
  static validationPassword(password){
       // Regex per validare la password: 8-20 caratteri, lettere, numeri e simboli speciali
    const passwordRegex = /^[a-zA-Z0-9.$*?!|/_]{8,20}$/i; // Regex per password: 8-20 caratteri, lettere, numeri e simboli speciali
    if (!passwordRegex.test(password)) {
      throw new Error("Password non valida");
    }
  }

  static validationEmail(email){
       // Regex per validare email: formato email standard
       const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

       if (!emailRegex.test(email)) {
         throw new Error("Email non valida");
       }
     }
  static validation(username, email, password) {
    // Regex per validare la password: 8-20 caratteri, lettere, numeri e simboli speciali
    const passwordRegex = /^[a-zA-Z0-9.$*?!|/_]{8,20}$/i; // Regex per password: 8-20 caratteri, lettere, numeri e simboli speciali
    if (!passwordRegex.test(password)) {
      throw new Error("Password non valida");
    }
  // Regex per validare username: 4-20 caratteri, lettere, numeri e simboli speciali
  const usernameRegex = /^[a-zA-Z0-9._]{4,20}$/;

  if (!usernameRegex.test(username)) {
    throw new Error("Username non valido");
  }

    // Regex per validare email: formato email standard
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email)) {
      throw new Error("Email non valida");
    }
  }

  async createUser({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error("Tutti i campi sono obbligatori");
    }

    UserService.validation(username, email, password); // Validazione dei dati in ingresso

    // Inizio della transazione
    const transaction = await sequelize.transaction();

    try {
      console.log("Inizio creazione utente");

      // Controllo unicità di username ed email
      const exists = await User.findOne({
        where: { [Op.or]: [{ username }, { email }] },
        transaction,
      });
      console.log("Controllo unicità completato:", exists);

      if (exists) {
        throw new Error("Username o email già esistenti");
      }

      // Creazione dell'utente
      const user = await userRepository.create(
        { username, email },
        { transaction }
      );
      console.log("Utente creato:", user);


      console.log("ID utente per UserPassword:", user.id);
      // Salvataggio della password
      await userPasswordService.createPassword(
      user.id,
        password ,
       transaction 
      );
      console.log("Password salvata");

      // Assegnazione del ruolo predefinito
      await userRoleService.assignDefaultRole(user.id, transaction);
      console.log("Ruolo assegnato");

      // Commit della transazione
      await transaction.commit();
      console.log("Transazione completata");

      return { success: true, user_id: user.id };
    } catch (error) {
      console.error("Errore durante la creazione utente:", error);
      await transaction.rollback();
      throw error;
    }
  }

  async updateser(id, { username, email, password }) {
    if (!username || !email || !password) {
      throw new Error("Tutti i campi sono obbligatori");
    }
    UserService.validation(username, email, password); // Validazione dei dati in ingresso
    // Controllo unicità di username ed email
    const transaction = await sequelize.transaction();

try {
  const exists = await User.findOne({
    where: { [Op.or]: [{ username },{email}] },
    transaction,
  });
  console.log("Controllo unicità completato:", exists);


  if (exists) {
    throw new Error("Username o email già esistenti");
  }

   // Aggiornamento dell'username
   const updatedUser = await userRepository.update(id, {username: username}, { transaction });
  if (!updatedUser) {
    throw new Error("Utente non trovato");
  }
  console.log("Username aggiornato:", updatedUser);

  // Aggiornamento dell'email
  const updatedEmail = await userRepository.update(id, {email: email}, { transaction });
  if (!updatedEmail) {
    throw new Error("Utente non trovato");
  }
  console.log("Email aggiornata:", updatedEmail);

  // Aggiornamento della password
  const comparisonResults = await userPasswordService.checkAllPasswords({
    user_id: id,
    password: password,
  });
  // Controllo unicità della password
  comparisonResults.forEach((p) => {
    if (p.isMatch) {
      throw new Error("La nuova password non può essere uguale a una password precedente e sono dentro comparisonResults"); // La password è già stata usata
    }
  });
  // Aggiornamento della password
  await userPasswordService.createPassword(id, password, transaction); // null per non usare transazione

  console.log("Password aggiornata con successo");

  // Aggiornamento della scadenza della password
  const updatedPassword = await userRepository.update(id, {
    password_expiration_days: 90, // Reset della scadenza

    last_modified_date: new Date(), // Aggiorna la data di modifica

  }, { transaction });
  if (!updatedPassword) {
    throw new Error("Utente non trovato");
  }
transaction.commit();
}catch (error) {
  console.error("Errore durante l'aggiornamento dell'utente:", error);
  await transaction.rollback();
  throw error;
}


  }
 // filepath: c:\Users\g.tocchi\Desktop\dpWay_test\dpWay_test\services\userService.js
 async updateUser(id, { username, email, password }) {
  if (!username && !email && !password) {
    throw new Error("Almeno un campo deve essere fornito");
  }

  const transaction = await sequelize.transaction();
  try {
    // Validazione e controllo unicità per username
    if (username) {
      UserService.validationUsername(username);
      const exists = await User.findOne({
        where: { 
          username, 
          id: { [Op.ne]: id } // Esclude l'utente con l'ID specificato
        },
        transaction,
      });
      if (exists) throw new Error("Username già in uso");
    }

    // Validazione e controllo unicità per email
    if (email) {
      UserService.validationEmail(email);
      const exists = await User.findOne({
        where: { 
          email, 
          id: { [Op.ne]: id } // Esclude l'utente con l'ID specificato
        },
        transaction,
      });
      if (exists) throw new Error("Email già in uso");
    }

    // Validazione e controllo unicità per password
    let comparisonResults = null;
    if (password) {
      UserService.validationPassword(password);
      comparisonResults = await userPasswordService.checkAllPasswords({
        user_id: id,
        password,
      });

      if (comparisonResults.some((p) => p.isMatch)) {
        throw new Error("La nuova password non può essere uguale a una password precedente");
      }
    }

    // Preparazione dei dati da aggiornare
    const updateData = {
      ...(username && { username }),
      ...(email && { email }),
      last_modified_date: new Date(),
      password_expiration_days: 90,
    };

    // Aggiornamento dell'utente
    const updatedUser = await userRepository.update(id, updateData, transaction);
    console.log("Utente aggiornato:", updatedUser);

    // Aggiornamento della password, se fornita
    if (password) {
      await userPasswordService.createPassword(id, password, transaction);
      console.log("Password aggiornata con successo");
    }

    // Commit della transazione
    await transaction.commit();
    console.log("Transazione completata con successo");
    return { success: true, message: "Utente aggiornato con successo" };
  } catch (error) {
    // Rollback della transazione in caso di errore
    await transaction.rollback();
    console.error("Errore durante l'aggiornamento dell'utente:", error);
    throw error;
  }
}
  // Modifica dell' username
  async updateUsername(userId, {newUsername},{transaction=null}) {
    if (!newUsername) {
    UserService.validationUsername(newUsername); // Validazione dell'username
    }
    // Controllo unicità
    const exists = await userRepository.findOne({ username: newUsername });
    if (exists) {
      throw new Error("Username già in uso");
    }

    // Aggiornamento dell'username
    const updatedUser = await userRepository.update(userId, {username: newUsername}, {transaction});
    if (!updatedUser) {
      throw new Error("Utente non trovato");
    }

    return { success: true, message: "Username aggiornato con successo" };
  }
  async updateEmail(userId, {newEmail}, {transaction=null}) {
    // Validazione dell'email
    UserService.validationEmail(newEmail); // Validazione dell'email

    // Controllo unicità
    const exists = await userRepository.findOne({ email: newEmail });
    if (exists) {
      throw new Error("Email già in uso");
    }

    // Aggiornamento dell'email
    const updatedUser = await userRepository.update(userId, { email: newEmail }, {transaction});  
    if (!updatedUser) {
      throw new Error("Utente non trovato");
    }

    return { success: true, message: "Email aggiornata con successo" };
  }
  async updatePassword(userId, {newPassword}, {transaction=null}) {
    // Validazione della password
  UserService.validationPassword(newPassword); // Validazione della password


    console.log('Contollo password-------------------------------------------:>')
    const comparisonResults = await userPasswordService.checkAllPasswords({
      user_id: userId,
      password: newPassword,
    });
    // Controllo unicità della password
    comparisonResults.forEach((p) => {
    if (p.isMatch) {
      throw new Error("La nuova password non può essere uguale a una password precedente e sono dentro comparisonResults"); // La password è già stata usata
    }
  
     
    });

    // Aggiornamento della password
    await userPasswordService.createPassword(userId, {newPassword}, {transaction}); // null per non usare transazione
    console.log("Password aggiornata con successo");

    // Aggiornamento della scadenza della password
    const updatedUser = await userRepository.update(userId, {
      password_expiration_days: 90, // Reset della scadenza
      last_modified_date: new Date(), // Aggiorna la data di modifica
    },{transaction});

    if (!updatedUser) {
      throw new Error("Utente non trovato");
    }

    return { success: true, message: "Password aggiornata con successo" };
  }




  // Controlla se la password è scaduta
  async checkPasswordExpiration(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("Utente non trovato");
    }

    const expirationDate = new Date(user.last_modified_date);
    expirationDate.setDate(
      expirationDate.getDate() + user.password_expiration_days
    );

    if (new Date() > expirationDate) {
      throw new Error("La password è scaduta. È necessario cambiarla.");
    }

    return { success: true, message: "Password valida" };
  }

 
  async deleteUser(id) {
    const transaction = await sequelize.transaction(); // Inizio della transazione
    try {
      // Controllo se l'utente esiste
      const user = await userRepository.findById(id);
      if (!user) {
        throw new Error("Utente non trovato");
      }
  
      // Elimina i ruoli associati all'utente
      await userRoleRepository.deleteByUserId(id, { transaction });
  
      // Elimina le password associate all'utente
      await userPasswordRepository.deleteByUserId(id, { transaction });
  
      // Elimina l'utente
      const userDeleted = await userRepository.delete(id, { transaction });
  
      // Commit della transazione
      await transaction.commit();
      return { success: true, message: "Utente e dati associati eliminati con successo" };
    } catch (error) {
      // Rollback della transazione in caso di errore
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new UserService(); // Singleton
