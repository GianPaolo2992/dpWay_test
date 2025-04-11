const {DataTypes} = require('sequelize');

const DbConnection = require('../config/db'); // Importa la connessione al DB
const { use } = require('../routes/userRoutes');

// Ottieni l'istanza di Sequelize dal DbConnection
const sequelize = new DbConnection().getSequelizeInstance();
const UserPassword = sequelize.define('UserPassword', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,  // Imposta 'id' come chiave primaria
      autoIncrement: true,  // Fa in modo che 'id' venga incrementato automaticamente
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    tableName: 'user_password',
    timestamps: false
  });



  module.exports = UserPassword;

