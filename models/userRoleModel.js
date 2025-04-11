const {DataTypes} = require('sequelize');

const DbConnection = require('../config/db'); // Importa la connessione al DB

// Ottieni l'istanza di Sequelize dal DbConnection
const sequelize = new DbConnection().getSequelizeInstance();
const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,  // Imposta 'id' come chiave primaria
    autoIncrement: true,  // Fa in modo che 'id' venga incrementato automaticamente
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
    created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
    tableName: 'user_role',
    timestamps: false
});



module.exports = UserRole;
