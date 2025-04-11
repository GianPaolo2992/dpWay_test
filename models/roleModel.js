const  {DataTypes}  = require('sequelize');
const DbConnection = require('../config/db'); // Importa la connessione al DB

// Ottieni l'istanza di Sequelize dal DbConnection
const sequelize = new DbConnection().getSequelizeInstance();

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,  // Imposta 'id' come chiave primaria
    autoIncrement: true,  // Fa in modo che 'id' venga incrementato automaticamente
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING
  },
  createdDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'role',
  timestamps: false
});

module.exports = Role;
