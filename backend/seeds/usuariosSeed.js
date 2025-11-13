// seeds/usuariosSeed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const usuariosSeed = [
  {
    nombre: "Administrador",
    email: "admin@gym.com",
    password: "admin123",
    edad: 30,
    sexo: "male",
    objetivo: "bienestar_general",
    role: "admin"
  },
  {
    nombre: "Manolito Gafotas",
    email: "manolitogafotas@ddddd.com",
    password: "123456",
    edad: 18,
    sexo: "male",
    objetivo: "aumento_masa",
    role: "user"
  },
  {
    nombre: "Ana Pérez",
    email: "ana.perez@gmail.com",
    password: "123456",
    edad: 25,
    sexo: "female",
    objetivo: "perdida_grasa",
    role: "user"
  }
];

const seedUsuarios = async () => {
  try {
    // Verificar si ya existen usuarios
    const count = await Usuario.countDocuments();
    if (count > 0) {
      console.log('Usuarios ya existen, se mantienen los actuales.');
      return;
    }
    
    // Hashear las contraseñas antes de insertar
    const usuariosConHashedPassword = await Promise.all(
      usuariosSeed.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    
    await Usuario.insertMany(usuariosConHashedPassword);
    console.log('Usuarios insertados correctamente');
  } catch (error) {
    console.error('Error insertando usuarios:', error);
  }
};

module.exports = seedUsuarios;