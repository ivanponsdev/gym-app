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
    sexo: "masculino",
    objetivo: "recomposicion_corporal",
    role: "admin",
    createdAt: new Date('2025-01-15')
  },
  {
    nombre: "Manolito Gafotas",
    email: "manolitogafotas@ddddd.com",
    password: "123456",
    edad: 18,
    sexo: "masculino",
    objetivo: "aumento_masa_muscular",
    role: "user",
    createdAt: new Date('2025-05-10')
  },
  {
    nombre: "Ana Pérez",
    email: "ana.perez@gmail.com",
    password: "123456",
    edad: 25,
    sexo: "femenino",
    objetivo: "perdida_grasa",
    role: "user",
    createdAt: new Date('2025-06-15')
  },
  {
    nombre: "Carlos Martínez",
    email: "carlos.m@gmail.com",
    password: "123456",
    edad: 42,
    sexo: "masculino",
    objetivo: "recomposicion_corporal",
    role: "user",
    createdAt: new Date('2025-07-20')
  },
  {
    nombre: "Laura Sánchez",
    email: "laura.s@gmail.com",
    password: "123456",
    edad: 28,
    sexo: "femenino",
    objetivo: "perdida_grasa",
    role: "user",
    createdAt: new Date('2025-08-05')
  },
  {
    nombre: "Pedro López",
    email: "pedro.l@gmail.com",
    password: "123456",
    edad: 55,
    sexo: "masculino",
    objetivo: "recomposicion_corporal",
    role: "user",
    createdAt: new Date('2025-08-15')
  },
  {
    nombre: "María García",
    email: "maria.g@gmail.com",
    password: "123456",
    edad: 32,
    sexo: "femenino",
    objetivo: "aumento_masa_muscular",
    role: "user",
    createdAt: new Date('2025-09-01')
  },
  {
    nombre: "Javier Ruiz",
    email: "javier.r@gmail.com",
    password: "123456",
    edad: 21,
    sexo: "masculino",
    objetivo: "aumento_masa_muscular",
    role: "user",
    createdAt: new Date('2025-09-10')
  },
  {
    nombre: "Carmen Díaz",
    email: "carmen.d@gmail.com",
    password: "123456",
    edad: 48,
    sexo: "femenino",
    objetivo: "perdida_grasa",
    role: "user",
    createdAt: new Date('2025-10-01'),
    fechaBaja: new Date('2025-12-15') // Usuario que se dio de baja
  },
  {
    nombre: "Roberto Fernández",
    email: "roberto.f@gmail.com",
    password: "123456",
    edad: 35,
    sexo: "masculino",
    objetivo: "recomposicion_corporal",
    role: "user",
    createdAt: new Date('2025-10-15')
  },
  {
    nombre: "Isabel Torres",
    email: "isabel.t@gmail.com",
    password: "123456",
    edad: 29,
    sexo: "femenino",
    objetivo: "perdida_grasa",
    role: "user",
    createdAt: new Date('2025-11-01')
  },
  {
    nombre: "Miguel Ángel",
    email: "miguel.a@gmail.com",
    password: "123456",
    edad: 60,
    sexo: "masculino",
    objetivo: "recomposicion_corporal",
    role: "user",
    createdAt: new Date('2025-11-10')
  },
  {
    nombre: "Sofía Moreno",
    email: "sofia.m@gmail.com",
    password: "123456",
    edad: 23,
    sexo: "femenino",
    objetivo: "aumento_masa_muscular",
    role: "user",
    createdAt: new Date('2025-11-20')
  },
  {
    nombre: "David Romero",
    email: "david.r@gmail.com",
    password: "123456",
    edad: 38,
    sexo: "masculino",
    objetivo: "perdida_grasa",
    role: "user",
    createdAt: new Date('2025-12-01')
  },
  {
    nombre: "Elena Navarro",
    email: "elena.n@gmail.com",
    password: "123456",
    edad: 27,
    sexo: "femenino",
    objetivo: "recomposicion_corporal",
    role: "user",
    createdAt: new Date('2025-12-10')
  },
  {
    nombre: "Alberto Serrano",
    email: "alberto.s@gmail.com",
    password: "123456",
    edad: 19,
    sexo: "masculino",
    objetivo: "aumento_masa_muscular",
    role: "user",
    createdAt: new Date('2025-12-20')
  },
  {
    nombre: "Patricia Molina",
    email: "patricia.m@gmail.com",
    password: "123456",
    edad: 44,
    sexo: "femenino",
    objetivo: "perdida_grasa",
    role: "user",
    createdAt: new Date('2026-01-05')
  }
];

const seedUsuarios = async () => {
  try {
    // Eliminar usuarios existentes
    await Usuario.deleteMany({});
    console.log('Usuarios anteriores eliminados');
    
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