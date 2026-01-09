const mongoose = require('mongoose');


const ejercicioSchema = new mongoose.Schema({
  // Nombre del ejercicio (ej: "Press de banca", "Sentadillas", "Dominadas")
  nombre: { 
    type: String, 
    required: [true, 'El nombre del ejercicio es obligatorio'],
    trim: true,
    unique: true
  },
  
  // Descripción
  descripcion: { 
    type: String, 
    trim: true,
    default: ''
  },
  
  // Grupo muscular
  grupoMuscular: { 
    type: String, 
    required: [true, 'El grupo muscular es obligatorio'],
    enum: {
      values: ['pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core'],
      message: 'El grupo muscular debe ser: pecho, espalda, piernas, hombros, brazos o core'
    }
  },
  
  // Nivel de dificultad del ejercicio
  dificultad: { 
    type: String, 
    required: [true, 'La dificultad es obligatoria'],
    enum: {
      values: ['principiante', 'intermedio', 'avanzado'],
      message: 'La dificultad debe ser: principiante, intermedio o avanzado'
    }
  },
  
  // Equipamiento necesario: casa (sin equipamiento/básico) o gimnasio (equipamiento completo)
  equipamiento: { 
    type: String, 
    required: [true, 'El tipo de equipamiento es obligatorio'],
    enum: {
      values: ['casa', 'gimnasio'],
      message: 'El equipamiento debe ser: casa o gimnasio'
    }
  },
  
  // Imagen 
  imagenTecnica: {
    type: String,
    default: ''
  }
  
}, { 
  timestamps: true 
});

// Índices para mejorar las consultas
ejercicioSchema.index({ grupoMuscular: 1 });
ejercicioSchema.index({ equipamiento: 1 });
ejercicioSchema.index({ grupoMuscular: 1, equipamiento: 1 });

module.exports = mongoose.model('Ejercicio', ejercicioSchema);
