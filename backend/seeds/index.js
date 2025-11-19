// seeds/index.js
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const seedUsuarios = require('./usuariosSeed');
const { seedClases } = require('./clasesSeed');

const runSeeds = async () => {
  await connectDB();

  console.log('\n=== Iniciando población de base de datos ===\n');
  
  // Poblar usuarios
  console.log(' Poblando usuarios...');
  await seedUsuarios();
  
  // Poblar clases
  console.log('\n Poblando clases...');
  await seedClases();
  
  console.log('\n=== ✓ Seeding completado correctamente ===\n');
  
  mongoose.connection.close();
};

runSeeds();