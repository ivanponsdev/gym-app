const Ejercicio = require('../models/Ejercicio');

const ejerciciosData = [
  // PECHO
  {
    nombre: 'Press de banca',
    descripcion: 'Ejercicio básico para el desarrollo del pecho. Acostado en banco plano, baja la barra hasta el pecho y empuja hacia arriba.',
    grupoMuscular: 'pecho',
    dificultad: 'intermedio',
    equipamiento: 'gimnasio'
  },
  {
    nombre: 'Flexiones',
    descripcion: 'Ejercicio fundamental para pecho, tríceps y core. Mantén el cuerpo recto y baja hasta que el pecho casi toque el suelo.',
    grupoMuscular: 'pecho',
    dificultad: 'principiante',
    equipamiento: 'casa'
  },
  {
    nombre: 'Aperturas con mancuernas',
    descripcion: 'Ejercicio de aislamiento para el pecho. Abre los brazos en forma de arco manteniendo ligera flexión en los codos.',
    grupoMuscular: 'pecho',
    dificultad: 'intermedio',
    equipamiento: 'gimnasio'
  },
  {
    nombre: 'Fondos en paralelas',
    descripcion: 'Ejercicio compuesto para pecho y tríceps. Inclínate hacia adelante para mayor activación del pecho.',
    grupoMuscular: 'pecho',
    dificultad: 'intermedio',
    equipamiento: 'gimnasio'
  },

  // ESPALDA
  {
    nombre: 'Dominadas',
    descripcion: 'Ejercicio rey para la espalda. Agarre prono más ancho que los hombros, sube hasta que la barbilla supere la barra.',
    grupoMuscular: 'espalda',
    dificultad: 'intermedio',
    equipamiento: 'gimnasio'
  },
  {
    nombre: 'Remo con barra',
    descripcion: 'Ejercicio compuesto para la espalda media. Mantén la espalda recta e inclínate hacia adelante 45 grados.',
    grupoMuscular: 'espalda',
    dificultad: 'intermedio',
    equipamiento: 'gimnasio'
  },
  {
    nombre: 'Peso muerto',
    descripcion: 'Ejercicio compuesto que trabaja toda la cadena posterior. Mantén la espalda neutral durante todo el movimiento.',
    grupoMuscular: 'espalda',
    dificultad: 'avanzado',
    equipamiento: 'gimnasio'
  },
  {
    nombre: 'Remo invertido',
    descripcion: 'Alternativa casera a los remos. Usa una mesa resistente, colócate debajo y tira del cuerpo hacia arriba.',
    grupoMuscular: 'espalda',
    dificultad: 'principiante',
    equipamiento: 'casa'
  },

  // PIERNAS
  {
    nombre: 'Sentadillas con barra',
    descripcion: 'Ejercicio fundamental para piernas. Baja hasta que los muslos estén paralelos al suelo manteniendo la espalda recta.',
    grupoMuscular: 'piernas',
    dificultad: 'intermedio',
    equipamiento: 'gimnasio'
  },
  {
    nombre: 'Zancadas',
    descripcion: 'Ejercicio unilateral para piernas. Da un paso largo adelante y baja hasta que ambas rodillas formen 90 grados.',
    grupoMuscular: 'piernas',
    dificultad: 'principiante',
    equipamiento: 'casa'
  },
  {
    nombre: 'Prensa de piernas',
    descripcion: 'Ejercicio de empuje para cuádriceps y glúteos. Coloca los pies al ancho de hombros en la plataforma.',
    grupoMuscular: 'piernas',
    dificultad: 'principiante',
    equipamiento: 'gimnasio'
  },
  {
    nombre: 'Sentadillas búlgaras',
    descripcion: 'Variante unilateral de sentadilla. Coloca un pie elevado detrás y baja con la pierna delantera.',
    grupoMuscular: 'piernas',
    dificultad: 'intermedio',
    equipamiento: 'casa'
  },
  {
    nombre: 'Curl femoral',
    descripcion: 'Ejercicio de aislamiento para los isquiotibiales. Flexiona las rodillas llevando los talones hacia los glúteos.',
    grupoMuscular: 'piernas',
    dificultad: 'principiante',
    equipamiento: 'gimnasio'
  },

  // HOMBROS
  {
    nombre: 'Press militar',
    descripcion: 'Ejercicio fundamental para hombros. Empuja la barra desde los hombros hasta extensión completa sobre la cabeza.',
    grupoMuscular: 'hombros',
    dificultad: 'intermedio',
    equipamiento: 'gimnasio'
  },
  {
    nombre: 'Elevaciones laterales',
    descripcion: 'Ejercicio de aislamiento para deltoides medios. Eleva los brazos lateralmente hasta la altura de los hombros.',
    grupoMuscular: 'hombros',
    dificultad: 'principiante',
    equipamiento: 'casa'
  },
  {
    nombre: 'Elevaciones frontales',
    descripcion: 'Ejercicio para deltoides anteriores. Eleva los brazos al frente hasta la altura de los hombros.',
    grupoMuscular: 'hombros',
    dificultad: 'principiante',
    equipamiento: 'casa'
  },
  {
    nombre: 'Pájaros',
    descripcion: 'Ejercicio para deltoides posteriores. Inclínate hacia adelante y abre los brazos lateralmente.',
    grupoMuscular: 'hombros',
    dificultad: 'intermedio',
    equipamiento: 'casa'
  },

  // BRAZOS
  {
    nombre: 'Curl de bíceps con barra',
    descripcion: 'Ejercicio básico para bíceps. Flexiona los codos manteniendo los brazos pegados al cuerpo.',
    grupoMuscular: 'brazos',
    dificultad: 'principiante',
    equipamiento: 'gimnasio'
  },
  {
    nombre: 'Extensiones de tríceps',
    descripcion: 'Ejercicio de aislamiento para tríceps. Extiende los brazos completamente manteniendo los codos fijos.',
    grupoMuscular: 'brazos',
    dificultad: 'principiante',
    equipamiento: 'casa'
  },
  {
    nombre: 'Curl martillo',
    descripcion: 'Variante de curl con agarre neutro. Trabaja bíceps y braquial anterior.',
    grupoMuscular: 'brazos',
    dificultad: 'principiante',
    equipamiento: 'casa'
  },
  {
    nombre: 'Press francés',
    descripcion: 'Ejercicio para tríceps. Baja el peso detrás de la cabeza flexionando solo los codos.',
    grupoMuscular: 'brazos',
    dificultad: 'intermedio',
    equipamiento: 'gimnasio'
  },

  // CORE
  {
    nombre: 'Plancha',
    descripcion: 'Ejercicio isométrico fundamental para el core. Mantén el cuerpo recto desde cabeza hasta pies.',
    grupoMuscular: 'core',
    dificultad: 'principiante',
    equipamiento: 'casa'
  },
  {
    nombre: 'Abdominales crunch',
    descripcion: 'Ejercicio básico para abdominales superiores. Eleva el torso enrollando la columna vertebral.',
    grupoMuscular: 'core',
    dificultad: 'principiante',
    equipamiento: 'casa'
  },
  {
    nombre: 'Elevaciones de piernas',
    descripcion: 'Ejercicio para abdominales inferiores. Eleva las piernas rectas hasta formar 90 grados con el torso.',
    grupoMuscular: 'core',
    dificultad: 'intermedio',
    equipamiento: 'casa'
  },
  {
    nombre: 'Russian twist',
    descripcion: 'Ejercicio para oblicuos. Sentado con piernas elevadas, rota el torso de lado a lado.',
    grupoMuscular: 'core',
    dificultad: 'intermedio',
    equipamiento: 'casa'
  },
  {
    nombre: 'Mountain climbers',
    descripcion: 'Ejercicio dinámico para core y cardio. En posición de plancha, alterna llevando las rodillas al pecho.',
    grupoMuscular: 'core',
    dificultad: 'intermedio',
    equipamiento: 'casa'
  }
];

const seedEjercicios = async () => {
  try {
    // Limpiar colección existente
    await Ejercicio.deleteMany({});
    console.log('Colección de ejercicios limpiada');
    
    // Insertar ejercicios de prueba
    const ejercicios = await Ejercicio.insertMany(ejerciciosData);
    console.log(`${ejercicios.length} ejercicios creados correctamente`);
    
    // Mostrar resumen por grupo muscular
    const grupos = ['pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core'];
    console.log('\n  Resumen por grupo muscular:');
    for (const grupo of grupos) {
      const count = ejercicios.filter(e => e.grupoMuscular === grupo).length;
      console.log(`    - ${grupo.charAt(0).toUpperCase() + grupo.slice(1)}: ${count} ejercicios`);
    }
    
    // Mostrar resumen por equipamiento
    const casa = ejercicios.filter(e => e.equipamiento === 'casa').length;
    const gimnasio = ejercicios.filter(e => e.equipamiento === 'gimnasio').length;
    console.log('\n  Resumen por equipamiento:');
    console.log(`    - Casa: ${casa} ejercicios`);
    console.log(`    - Gimnasio: ${gimnasio} ejercicios`);
    
  } catch (error) {
    console.error(' Error al poblar ejercicios:', error);
    throw error;
  }
};

module.exports = seedEjercicios;
