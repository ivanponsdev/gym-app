// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gymAppBD');
    console.log(' MongoDB conectado correctamente');
  } catch (error) {
    console.error('ERROR: No se pudo conectar con MongoDB:', error.message);
    process.exit(1); // Detener el servidor si no hay conexión a MongoDB
  }
};

module.exports = connectDB;