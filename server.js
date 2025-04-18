const express = require('express');
const cors = require('cors');
const DbConnection = require('./config/db');
// Usa le rotte definite nel file userRoutes
const userRoutes = require('./routes/userRoutes'); // Importa le rotte degli utenti

// Importa le associazioni
require('./models/associations'); // Importa e configura le associazioni

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  const sequelize = new DbConnection();
  await sequelize.getConnection(); // Connessione al DB prima di partire

  console.log(`🚀 Server running on port ${PORT}`);
});
