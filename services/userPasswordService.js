const bcrypt = require('bcrypt');

const userPasswordRepository = require('../repositories/userPasswordRepository');

class UserPasswordService {

  // Crea una nuova password per l'utente
  async createPassword(userId, plainPassword, transaction) {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    console.log('Dati per UserPassword:', { user_id: userId, password: passwordHash });
    return userPasswordRepository.create( userId, passwordHash, transaction);
  }

  // Controlla se la password è già stata usata
 async checkAllPasswords({ user_id: userId, password: newPassword }) {
    const passwords = await userPasswordRepository.findAll({ where: { user_id: userId } });
  
    console.log('Trovate password:', passwords);
  
    if (passwords.length === 0) {
      throw new Error('Nessuna password trovata per l\'utente fornito');
    }
  
    const comparisons = await Promise.all(
      passwords.map(async (p) => {
        const isMatch = await bcrypt.compare(newPassword, p.password);
        return { hashedPassword: p.password, isMatch };
      })
    );
  
    console.log('Risultati dei confronti:', comparisons);
  
    return comparisons;
  }


  // Trova una password per un utente specifico
  async findOne({ user_id: userId, password: newPassword }){
    const userPassword = await userPasswordRepository.findOne({ where: { user_id: userId } });
    if (!userPassword) {
      throw new Error('Password non trovata per l\'utente fornito');
    }
    console.log('Password found for user:', userPassword.password);
    const isMatch = await bcrypt.compare(newPassword, userPassword.password);
    if (!isMatch) {
      return isMatch;
    }
 return isMatch;
  }
}

module.exports = new UserPasswordService();