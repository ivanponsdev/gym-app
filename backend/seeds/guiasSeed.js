const Guia = require('../models/Guia');

const guiasData = [
  // aumento de masa muscular
  {
    titulo: 'Hábitos de Alimentación para Aumento de Masa Muscular',
    descripcion: 'Guía completa sobre hábitos nutricionales para maximizar el crecimiento muscular. Incluye frecuencia de comidas, tipos de alimentos, cantidades y timing nutricional.',
    objetivo: 'aumento_masa_muscular',
    archivoUrl: 'backend/uploads/guias/habitos-alimentacion-masa-muscular.pdf',
    activa: true
  },
  {
    titulo: 'Hábitos de Entrenamiento para Aumento de Masa Muscular',
    descripcion: 'Rutinas y hábitos de entrenamiento enfocados en hipertrofia. Frecuencia semanal, selección de ejercicios, rangos de repeticiones y técnicas de intensidad.',
    objetivo: 'aumento_masa_muscular',
    archivoUrl: 'backend/uploads/guias/habitos-entrenamiento-masa-muscular.pdf',
    activa: true
  },

  // recomposición corporal
  {
    titulo: 'Hábitos de Alimentación para Recomposición Corporal',
    descripcion: 'Estrategias alimentarias para perder grasa y ganar músculo simultáneamente. Balance calórico, distribución de macros y timing estratégico.',
    objetivo: 'recomposicion_corporal',
    archivoUrl: 'backend/uploads/guias/habitos-alimentacion-recomposicion.pdf',
    activa: true
  },
  {
    titulo: 'Hábitos de Entrenamiento para Recomposición Corporal',
    descripcion: 'Programa de entrenamiento combinado de fuerza y acondicionamiento. Balance entre trabajo de hipertrofia y gasto calórico.',
    objetivo: 'recomposicion_corporal',
    archivoUrl: 'backend/uploads/guias/habitos-entrenamiento-recomposicion.pdf',
    activa: true
  },

  // pérdida de grasa
  {
    titulo: 'Hábitos de Alimentación para Pérdida de Grasa',
    descripcion: 'Hábitos nutricionales para la pérdida de grasa sostenible. Déficit calórico saludable, control del hambre y adherencia a largo plazo.',
    objetivo: 'perdida_grasa',
    archivoUrl: 'backend/uploads/guias/habitos-alimentacion-perdida-grasa.pdf',
    activa: true
  },
  {
    titulo: 'Hábitos de Entrenamiento para Pérdida de Grasa',
    descripcion: 'Estrategias de entrenamiento para maximizar la quema de grasa. Combinación de entrenamiento de fuerza y cardio estratégico.',
    objetivo: 'perdida_grasa',
    archivoUrl: 'backend/uploads/guias/habitos-entrenamiento-perdida-grasa.pdf',
    activa: true
  },

  // para todos los objetivos
  {
    titulo: 'Hábitos de Descanso',
    descripcion: 'Guía sobre la importancia del descanso y recuperación. Optimización del sueño, técnicas de relajación y gestión del estrés para maximizar resultados.',
    objetivo: 'todos',
    archivoUrl: 'backend/uploads/guias/habitos-descanso.pdf',
    activa: true
  },
  {
    titulo: 'Hábitos Saludables Generales',
    descripcion: 'Fundamentos de un estilo de vida saludable. Hidratación, actividad diaria, gestión del estrés, relaciones sociales y bienestar mental.',
    objetivo: 'todos',
    archivoUrl: 'backend/uploads/guias/habitos-saludables-generales.pdf',
    activa: true
  }
];

const seedGuias = async () => {
  try {
    // Eliminar guías existentes
    await Guia.deleteMany({});
    console.log('Guías existentes eliminadas');

    // Insertar nuevas guías
    await Guia.insertMany(guiasData);
    console.log(`✓ ${guiasData.length} guías insertadas correctamente`);
  } catch (error) {
    console.error('Error al poblar guías:', error);
    throw error;
  }
};

module.exports = seedGuias;
