const {DataTypes} = require('sequelize');
const DbConnection = require('../config/db'); // Importa la connessione al DB

// Ottieni l'istanza di Sequelize dal DbConnection
const sequelize = new DbConnection().getSequelizeInstance();

const Blacklist = sequelize.define('Blacklist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,  // Imposta 'id' come chiave primaria
    autoIncrement: true,  // Fa in modo che 'id' venga incrementato automaticamente
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  }
}, {
  tableName: 'blacklist',
  timestamps: false
});

module.exports = Blacklist;
