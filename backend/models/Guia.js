const mongoose = require('mongoose');

const guiaSchema = new mongoose.Schema({
  // Título de la guía
  titulo: { 
    type: String, 
    required: [true, 'El título es obligatorio'],
    trim: true 
  },
  
  // Descripción de la guía
  descripcion: { 
    type: String, 
    trim: true,
    default: ''
  },
  
  // Objetivo al que va dirigida la guía
  objetivo: { 
    type: String, 
    required: [true, 'El objetivo es obligatorio'],
    enum: {
      values: ['aumento_masa_muscular', 'recomposicion_corporal', 'perdida_grasa', 'todos'],
      message: 'El objetivo debe ser: aumento_masa_muscular, recomposicion_corporal, perdida_grasa o todos'
    }
  },
  
  // Ruta del archivo PDF
  archivoUrl: {
    type: String,
    required: [true, 'El archivo PDF es obligatorio']
  },
  
  // Estado de la guía
  activa: {
    type: Boolean,
    default: true
  }
  
}, { 
  timestamps: true 
});

// Índice para filtrar por objetivo
guiaSchema.index({ objetivo: 1 });
guiaSchema.index({ activa: 1 });

module.exports = mongoose.model('Guia', guiaSchema);
