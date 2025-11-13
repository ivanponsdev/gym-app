const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // almacenaremos hash
  edad: { type: Number, min: 0 },
  sexo: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  objetivo: { type: String, enum: ['aumento_masa', 'perdida_grasa', 'bienestar_general'], default: 'bienestar_general' },
  role: { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Usuario', usuarioSchema);