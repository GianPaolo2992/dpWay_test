// db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();


let instance = null;

class DbConnection {
  constructor() {
    if (instance) return instance;

    this.sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT,
        logging: false, // Disabilita il logging
      }
    );
   
    instance = this;
  }

  async getConnection() {
    try {
      await this.sequelize.authenticate();
      await this.sequelize.sync({ alter: true });
     
      console.log('Database connected successfully!');

    } catch (error) {
      console.error("Errore durante la connessione al database:", error);
    }
     
      
  }

  // Esportare l'istanza di sequelize per poterla usare nei modelli
  getSequelizeInstance() {
    return this.sequelize;
  }
}

{/*  async closeConnection() {
    try {
      await this.sequelize.close();
      console.log('Database connection closed successfully!');
    } catch (error) {
      console.error("Errore durante la chiusura della connessione al database:", error);
    }*/}
  


module.exports = DbConnection;
