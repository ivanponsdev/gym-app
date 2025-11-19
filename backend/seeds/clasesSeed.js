const Clase = require('../models/Clase');

/**
 * Seed de clases de ejemplo para el gimnasio
 * Incluye diferentes tipos de clases distribuidas a lo largo de la semana
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
  
  // MIÉRCOLES
  {
    nombre: 'Body Combat',
    descripcion: 'Entrenamiento cardiovascular inspirado en artes marciales. Alta intensidad y quema de calorías.',
    diaSemana: 'miércoles',
    horaInicio: '08:00',
    horaFin: '09:00',
    profesor: 'David Ruiz',
    cupoMaximo: 25,
    activa: true
  },
  {
    nombre: 'Estiramientos',
    descripcion: 'Sesión dedicada a mejorar la flexibilidad y prevenir lesiones. Perfecta para complementar otros entrenamientos.',
    diaSemana: 'miércoles',
    horaInicio: '14:00',
    horaFin: '15:00',
    profesor: 'Ana García',
    cupoMaximo: 15,
    activa: true
  },
  {
    nombre: 'GAP (Glúteos, Abdomen, Piernas)',
    descripcion: 'Entrenamiento focalizado en el tren inferior y core. Tonifica y fortalece.',
    diaSemana: 'miércoles',
    horaInicio: '18:30',
    horaFin: '19:30',
    profesor: 'Laura Sánchez',
    cupoMaximo: 22,
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
    nombre: 'TRX',
    descripcion: 'Entrenamiento en suspensión que utiliza el peso corporal. Mejora fuerza, equilibrio y flexibilidad.',
    diaSemana: 'jueves',
    horaInicio: '19:00',
    horaFin: '20:00',
    profesor: 'Miguel Torres',
    cupoMaximo: 12,
    activa: true
  },
  
  // VIERNES
  {
    nombre: 'Yoga Vinyasa',
    descripcion: 'Estilo dinámico de yoga que sincroniza movimiento y respiración. Nivel intermedio.',
    diaSemana: 'viernes',
    horaInicio: '10:00',
    horaFin: '11:30',
    profesor: 'Ana García',
    cupoMaximo: 18,
    activa: true
  },
  {
    nombre: 'HIIT (High Intensity Interval Training)',
    descripcion: 'Entrenamiento por intervalos de alta intensidad. Máxima quema de calorías en poco tiempo.',
    diaSemana: 'viernes',
    horaInicio: '18:00',
    horaFin: '19:00',
    profesor: 'David Ruiz',
    cupoMaximo: 20,
    activa: true
  },
  
  // SÁBADO
  {
    nombre: 'Yoga para Principiantes',
    descripcion: 'Introducción al yoga. Posturas básicas, respiración y relajación. Sin experiencia previa necesaria.',
    diaSemana: 'sábado',
    horaInicio: '09:00',
    horaFin: '10:00',
    profesor: 'Ana García',
    cupoMaximo: 25,
    activa: true
  },
  {
    nombre: 'Funcional',
    descripcion: 'Entrenamiento basado en movimientos naturales del cuerpo. Mejora la fuerza funcional para el día a día.',
    diaSemana: 'sábado',
    horaInicio: '11:00',
    horaFin: '12:00',
    profesor: 'Miguel Torres',
    cupoMaximo: 20,
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

/**
 * Función para poblar la base de datos con clases de ejemplo
 */
const seedClases = async () => {
  try {
    // Eliminar todas las clases existentes
    await Clase.deleteMany({});
    console.log('✓ Clases existentes eliminadas');
    
    // Insertar las clases de ejemplo
    const clasesInsertadas = await Clase.insertMany(clasesEjemplo);
    console.log(`✓ ${clasesInsertadas.length} clases insertadas correctamente`);
    
    return clasesInsertadas;
  } catch (error) {
    console.error('✗ Error al crear clases de ejemplo:', error.message);
    throw error;
  }
};

module.exports = { seedClases, clasesEjemplo };
