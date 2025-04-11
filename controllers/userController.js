const userService = require('../services/userService');

class UserController {
  static instance;

  constructor() {
    if (UserController.instance) {
      return UserController.instance;
    }
    UserController.instance = this;
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getUsers();
      res.status(200).json({ users: users });
    } catch (err) {
      res.status(500).json({ error: 'Errore nel recupero utenti', error: err.message });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (user) res.json(user);
    else res.status(404).json({ message: 'Utente non trovato' });
  }

  async createUser(req, res) {
    try {
      const result = await userService.createUser(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const updated = await userService.updateUser(id, req.body);
    if (updated) res.json(updated);
    else res.status(404).json({ message: 'Utente non trovato' });
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);
    if (deleted) res.status(204).send();
    else res.status(404).json({ message: 'Utente non trovato' });
  }
}

module.exports = new UserController(); // Singleton
