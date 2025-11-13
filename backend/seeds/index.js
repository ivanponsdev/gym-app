// seeds/index.js
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const seedUsuarios = require('./usuariosSeed');

const runSeeds = async () => {
  await connectDB();

  await seedUsuarios();

  mongoose.connection.close();
  console.log('Seeding completado!');
};

runSeeds();