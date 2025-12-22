const Clase = require('../models/Clase');

/**
 * Seed de clases de ejemplo para el gimnasio
 * Solo incluye las 5 clases con colores asignados: Spinning, Yoga Matinal, CrossFit, Pilates y Zumba
 */
const clasesEjemplo = [
  // LUNES
  {
    nombre: 'Spinning',
    descripcion: 'Clase de ciclismo indoor de alta intensidad. Perfecta para quemar calorías y mejorar la resistencia cardiovascular.',
    diaSemana: 'lunes',
    horaInicio: '07:00',
    horaFin: '08:00',
    profesor: 'Carlos Martínez',
    cupoMaximo: 25,
    activa: true
  },
  {
    nombre: 'Yoga Matinal',
    descripcion: 'Sesión de yoga para comenzar el día con energía. Incluye posturas, respiración y meditación.',
    diaSemana: 'lunes',
    horaInicio: '09:00',
    horaFin: '10:00',
    profesor: 'Ana García',
    cupoMaximo: 20,
    activa: true
  },
  {
    nombre: 'CrossFit',
    descripcion: 'Entrenamiento funcional de alta intensidad. Combina levantamiento de pesas, gimnasia y cardio.',
    diaSemana: 'lunes',
    horaInicio: '18:00',
    horaFin: '19:00',
    profesor: 'Miguel Torres',
    cupoMaximo: 15,
    activa: true
  },
  
  // MARTES
  {
    nombre: 'Pilates',
    descripcion: 'Método de ejercicio que fortalece el core y mejora la flexibilidad. Apto para todos los niveles.',
    diaSemana: 'martes',
    horaInicio: '10:00',
    horaFin: '11:00',
    profesor: 'Laura Sánchez',
    cupoMaximo: 18,
    activa: true
  },
  {
    nombre: 'Zumba',
    descripcion: 'Baile fitness con ritmos latinos. Divertida forma de quemar calorías mientras bailas.',
    diaSemana: 'martes',
    horaInicio: '19:00',
    horaFin: '20:00',
    profesor: 'Carmen López',
    cupoMaximo: 30,
    activa: true
  },
  {
    nombre: 'Spinning',
    descripcion: 'Clase de ciclismo indoor de alta intensidad. Perfecta para quemar calorías y mejorar la resistencia cardiovascular.',
    diaSemana: 'martes',
    horaInicio: '20:00',
    horaFin: '21:00',
    profesor: 'Carlos Martínez',
    cupoMaximo: 25,
    activa: true
  },
  
  // MIÉRCOLES
  {
    nombre: 'Yoga Matinal',
    descripcion: 'Sesión de yoga para comenzar el día con energía. Incluye posturas, respiración y meditación.',
    diaSemana: 'miércoles',
    horaInicio: '08:00',
    horaFin: '09:00',
    profesor: 'Ana García',
    cupoMaximo: 20,
    activa: true
  },
  {
    nombre: 'CrossFit',
    descripcion: 'Entrenamiento funcional de alta intensidad. Combina levantamiento de pesas, gimnasia y cardio.',
    diaSemana: 'miércoles',
    horaInicio: '18:30',
    horaFin: '19:30',
    profesor: 'Miguel Torres',
    cupoMaximo: 15,
    activa: true
  },
  {
    nombre: 'Pilates',
    descripcion: 'Método de ejercicio que fortalece el core y mejora la flexibilidad. Apto para todos los niveles.',
    diaSemana: 'miércoles',
    horaInicio: '20:00',
    horaFin: '21:00',
    profesor: 'Laura Sánchez',
    cupoMaximo: 18,
    activa: true
  },
  
  // JUEVES
  {
    nombre: 'Spinning',
    descripcion: 'Clase de ciclismo indoor de alta intensidad. Perfecta para quemar calorías y mejorar la resistencia cardiovascular.',
    diaSemana: 'jueves',
    horaInicio: '07:00',
    horaFin: '08:00',
    profesor: 'Carlos Martínez',
    cupoMaximo: 25,
    activa: true
  },
  {
    nombre: 'Zumba',
    descripcion: 'Baile fitness con ritmos latinos. Divertida forma de quemar calorías mientras bailas.',
    diaSemana: 'jueves',
    horaInicio: '19:00',
    horaFin: '20:00',
    profesor: 'Carmen López',
    cupoMaximo: 30,
    activa: true
  },
  
  // VIERNES
  {
    nombre: 'Yoga Matinal',
    descripcion: 'Sesión de yoga para comenzar el día con energía. Incluye posturas, respiración y meditación.',
    diaSemana: 'viernes',
    horaInicio: '10:00',
    horaFin: '11:00',
    profesor: 'Ana García',
    cupoMaximo: 20,
    activa: true
  },
  {
    nombre: 'CrossFit',
    descripcion: 'Entrenamiento funcional de alta intensidad. Combina levantamiento de pesas, gimnasia y cardio.',
    diaSemana: 'viernes',
    horaInicio: '18:00',
    horaFin: '19:00',
    profesor: 'Miguel Torres',
    cupoMaximo: 15,
    activa: true
  },
  {
    nombre: 'Pilates',
    descripcion: 'Método de ejercicio que fortalece el core y mejora la flexibilidad. Apto para todos los niveles.',
    diaSemana: 'viernes',
    horaInicio: '19:30',
    horaFin: '20:30',
    profesor: 'Laura Sánchez',
    cupoMaximo: 18,
    activa: true
  },
  
  // SÁBADO
  {
    nombre: 'Yoga Matinal',
    descripcion: 'Sesión de yoga para comenzar el día con energía. Incluye posturas, respiración y meditación.',
    diaSemana: 'sábado',
    horaInicio: '09:00',
    horaFin: '10:00',
    profesor: 'Ana García',
    cupoMaximo: 20,
    activa: true
  },
  {
    nombre: 'Spinning',
    descripcion: 'Clase de ciclismo indoor de alta intensidad. Perfecta para quemar calorías y mejorar la resistencia cardiovascular.',
    diaSemana: 'sábado',
    horaInicio: '11:00',
    horaFin: '12:00',
    profesor: 'Carlos Martínez',
    cupoMaximo: 25,
    activa: true
  },
  {
    nombre: 'Zumba',
    descripcion: 'Baile fitness con ritmos latinos. Divertida forma de quemar calorías mientras bailas.',
    diaSemana: 'sábado',
    horaInicio: '17:00',
    horaFin: '18:00',
    profesor: 'Carmen López',
    cupoMaximo: 30,
    activa: true
  }
];

const seedClases = async () => {
  try {
    // Eliminar clases existentes
    await Clase.deleteMany({});
    console.log('   Clases anteriores eliminadas');
    
    await Clase.insertMany(clasesEjemplo);
    console.log('   ✓ Clases insertadas correctamente');
  } catch (error) {
    console.error('Error insertando clases:', error);
  }
};

module.exports = { seedClases };
