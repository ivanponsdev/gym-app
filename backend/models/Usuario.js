const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // almacenaremos hash
  edad: { type: Number, min: 14, max: 100 },
  sexo: { type: String, enum: ['masculino', 'femenino', 'otro'], default: 'otro' },
  objetivo: { 
    type: String, 
    enum: ['aumento_masa_muscular', 'recomposicion_corporal', 'perdida_grasa'], 
    default: 'recomposicion_corporal' 
  },
  objetivoClasesSemana: {
  type: Number,
  default: 4,
  min: 1,
  max: 10
},
  role: { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Usuario', usuarioSchema);