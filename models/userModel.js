const { DataTypes } = require('sequelize');
const DbConnection = require('../config/db'); // Importa la connessione al DB

// Ottieni l'istanza di Sequelize dal DbConnection
const sequelize = new DbConnection().getSequelizeInstance();

const UserRole = require('./userRoleModel'); // Importa il modello UserRole
const UserPassword = require('./userPasswordModel'); // Importa il modello UserPassword



const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,  // Imposta 'id' come chiave primaria
      autoIncrement: true,  // Fa in modo che 'id' venga incrementato automaticamente
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9._]{4,20}$/i,
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password_expiration_days: {
      type: DataTypes.INTEGER,
      defaultValue: 90
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    last_modified_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },  
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'user',
    timestamps: false
  });


  module.exports = User;
