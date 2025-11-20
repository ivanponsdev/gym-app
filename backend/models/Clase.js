const mongoose = require('mongoose');

/**
 * Modelo de Clase para el gimnasio
 * 
 * Este modelo define las clases grupales que se ofrecen en el gimnasio.
 * Los administradores pueden crear, modificar y eliminar clases.
 * Los usuarios pueden ver las clases disponibles e inscribirse en ellas.
 */
const claseSchema = new mongoose.Schema({
  // Nombre de la clase (ej: "Spinning", "Yoga", "CrossFit")
  nombre: { 
    type: String, 
    required: [true, 'El nombre de la clase es obligatorio'],
    trim: true 
  },
  
  // Descripción detallada de la clase
  descripcion: { 
    type: String, 
    trim: true,
    default: ''
  },
  
  // Día de la semana en que se imparte la clase
  diaSemana: { 
    type: String, 
    required: [true, 'El día de la semana es obligatorio'],
    enum: {
      values: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
      message: 'El día debe ser uno de los días de la semana válidos'
    }
  },
  
  // Hora de inicio de la clase (formato: "HH:MM" ej: "09:00")
  horaInicio: { 
    type: String, 
    required: [true, 'La hora de inicio es obligatoria'],
    validate: {
      validator: function(v) {
        // Validar formato HH:MM (24 horas)
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'La hora debe tener el formato HH:MM (ej: 09:00, 14:30)'
    }
  },
  
  // Hora de fin de la clase (formato: "HH:MM" ej: "10:00")
  horaFin: { 
    type: String, 
    required: [true, 'La hora de fin es obligatoria'],
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'La hora debe tener el formato HH:MM (ej: 09:00, 14:30)'
    }
  },
  
  // Nombre del profesor que imparte la clase
  profesor: { 
    type: String, 
    required: [true, 'El nombre del profesor es obligatorio'],
    trim: true 
  },
  
  // Número máximo de alumnos que pueden inscribirse
  cupoMaximo: { 
    type: Number, 
    required: [true, 'El cupo máximo es obligatorio'],
    min: [1, 'El cupo debe ser al menos 1'],
    default: 20
  },
  
  // Array de IDs de usuarios inscritos en esta clase
  alumnosApuntados: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario' 
  }],
  
  // Estado de la clase (activa/inactiva)
  activa: {
    type: Boolean,
    default: true
  }
  
}, { 
  timestamps: true  // Añade automáticamente createdAt y updatedAt
});

// Índice compuesto para evitar duplicados de clases en el mismo día y hora
claseSchema.index({ diaSemana: 1, horaInicio: 1, nombre: 1 });

// Método virtual para obtener el número de plazas disponibles
claseSchema.virtual('plazasDisponibles').get(function() {
  return this.cupoMaximo - this.alumnosApuntados.length;
});

// Método virtual para saber si la clase está completa
claseSchema.virtual('estaCompleta').get(function() {
  return this.alumnosApuntados.length >= this.cupoMaximo;
});

// Asegurar que los campos virtuales se incluyan en JSON y Object
claseSchema.set('toJSON', { virtuals: true });
claseSchema.set('toObject', { virtuals: true });


claseSchema.methods.estaApuntado = function(usuarioId) {
  return this.alumnosApuntados.some(id => id.toString() === usuarioId.toString());
};

module.exports = mongoose.model('Clase', claseSchema);
