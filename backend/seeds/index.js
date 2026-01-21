// seeds/index.js
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const seedUsuarios = require('./usuariosSeed');
const { seedClases } = require('./clasesSeed');
const seedEjercicios = require('./ejerciciosSeed');
const seedGuias = require('./guiasSeed');

const runSeeds = async () => {
  await connectDB();
  console.log(' Iniciando población de base de datos ');
  // Poblar usuarios
  console.log('Poblando usuarios...');
  await seedUsuarios();
  // Poblar clases
  console.log(' Poblando clases...');
  await seedClases();
  // Poblar ejercicios
  console.log('Poblando ejercicios...');
  await seedEjercicios();
  // Poblar guías
  console.log('Poblando guías...');
  await seedGuias();
  console.log('Seeding completado correctamente ');
  mongoose.connection.close();
};

runSeeds();