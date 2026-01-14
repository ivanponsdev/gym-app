const Clase = require('../models/Clase');
const Usuario = require('../models/Usuario');

//Obtener todas las clases (públicas/activas)
const getClases = async (req, res) => {
  try {
    // Filtros opcionales por query params
    const { diaSemana, activa } = req.query;
    const filtro = {};
    
    if (diaSemana) filtro.diaSemana = diaSemana;
    if (activa !== undefined) filtro.activa = activa === 'true';
    
    // Ordenar por día y hora
    const ordenDias = {
      'lunes': 1, 'martes': 2, 'miércoles': 3, 'jueves': 4,
      'viernes': 5, 'sábado': 6, 'domingo': 7
    };
    
    const clases = await Clase.find(filtro).lean();
    
    // Ordenar manualmente por día y hora
    clases.sort((a, b) => {
      const diaA = ordenDias[a.diaSemana] || 8;
      const diaB = ordenDias[b.diaSemana] || 8;
      if (diaA !== diaB) return diaA - diaB;
      return a.horaInicio.localeCompare(b.horaInicio);
    });
    
    // Añadir información calculada
    const clasesConInfo = clases.map(clase => ({
      ...clase,
      plazasDisponibles: clase.cupoMaximo - clase.alumnosApuntados.length,
      estaCompleta: clase.alumnosApuntados.length >= clase.cupoMaximo,
      numeroInscritos: clase.alumnosApuntados.length
    }));
    
    res.json({
      total: clasesConInfo.length,
      clases: clasesConInfo
    });
  } catch (error) {
    console.error('Error al obtener clases:', error);
    res.status(500).json({ 
      message: 'Error al obtener clases', 
      error: error.message 
    });
  }
};

//Obtener clase por ID
const getClaseById = async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.id)
      .populate('alumnosApuntados', 'nombre email');
    
    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }
    
    res.json({ clase });
  } catch (error) {
    console.error('Error al obtener la clase:', error);
    res.status(500).json({ 
      message: 'Error al obtener la clase', 
      error: error.message 
    });
  }
};

//Obtener las clases a las que está apuntado el usuario autenticado
const getMisClases = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    
    // Buscar clases donde el usuario esté en alumnosApuntados
    const clases = await Clase.find({ 
      alumnosApuntados: usuarioId
    }).sort({ diaSemana: 1, horaInicio: 1 });
    
    res.json({
      total: clases.length,
      clases
    });
  } catch (error) {
    console.error('Error al obtener tus clases:', error);
    res.status(500).json({ 
      message: 'Error al obtener tus clases', 
      error: error.message 
    });
  }
};

//Crear una nueva clase
const createClase = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      diaSemana, 
      horaInicio, 
      horaFin, 
      profesor, 
      cupoMaximo,
      activa 
    } = req.body;
    
    // Validaciones básicas
    if (!nombre || !diaSemana || !horaInicio || !horaFin || !profesor) {
      return res.status(400).json({ 
        message: 'Faltan campos obligatorios: nombre, diaSemana, horaInicio, horaFin, profesor' 
      });
    }
    
    // Validar que horaFin sea posterior a horaInicio
    if (horaInicio >= horaFin) {
      return res.status(400).json({ 
        message: 'La hora de fin debe ser posterior a la hora de inicio' 
      });
    }
    
    // Verificar si ya existe una clase similar
    const claseExistente = await Clase.findOne({ 
      nombre, 
      diaSemana, 
      horaInicio 
    });
    
    if (claseExistente) {
      return res.status(409).json({ 
        message: 'Ya existe una clase con ese nombre en el mismo día y hora' 
      });
    }
    
    const nuevaClase = new Clase({
      nombre,
      descripcion,
      diaSemana,
      horaInicio,
      horaFin,
      profesor,
      cupoMaximo: cupoMaximo || 20,
      activa: activa !== undefined ? activa : true,
      alumnosApuntados: []
    });
    
    const claseGuardada = await nuevaClase.save();
    
    res.status(201).json({ 
      message: 'Clase creada correctamente',
      clase: claseGuardada 
    });
  } catch (error) {
    console.error('Error al crear clase:', error);
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Error de validación', 
        errores 
      });
    }
    res.status(500).json({ 
      message: 'Error al crear clase', 
      error: error.message 
    });
  }
};

//Actualizar clase por id
const updateClase = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      diaSemana, 
      horaInicio, 
      horaFin, 
      profesor, 
      cupoMaximo,
      activa 
    } = req.body;
    
    const clase = await Clase.findById(req.params.id);
    
    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }
    
    // Validar que el nuevo cupo no sea menor que los alumnos ya apuntados
    if (cupoMaximo && cupoMaximo < clase.alumnosApuntados.length) {
      return res.status(400).json({ 
        message: `No se puede reducir el cupo a ${cupoMaximo}. Ya hay ${clase.alumnosApuntados.length} alumnos apuntados` 
      });
    }
    
    // Validar horarios si se actualizan
    const nuevaHoraInicio = horaInicio || clase.horaInicio;
    const nuevaHoraFin = horaFin || clase.horaFin;
    
    if (nuevaHoraInicio >= nuevaHoraFin) {
      return res.status(400).json({ 
        message: 'La hora de fin debe ser posterior a la hora de inicio' 
      });
    }
    
    // Actualizar campos
    if (nombre) clase.nombre = nombre;
    if (descripcion !== undefined) clase.descripcion = descripcion;
    if (diaSemana) clase.diaSemana = diaSemana;
    if (horaInicio) clase.horaInicio = horaInicio;
    if (horaFin) clase.horaFin = horaFin;
    if (profesor) clase.profesor = profesor;
    if (cupoMaximo) clase.cupoMaximo = cupoMaximo;
    if (activa !== undefined) clase.activa = activa;
    
    const claseActualizada = await clase.save();
    
    res.json({
      message: 'Clase actualizada correctamente',
      clase: claseActualizada
    });
  } catch (error) {
    console.error('Error al actualizar clase:', error);
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Error de validación', 
        errores 
      });
    }
    res.status(500).json({ 
      message: 'Error al actualizar clase', 
      error: error.message 
    });
  }
};

//Delete por clase
const deleteClase = async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.id);
    
    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }
    
    // Informar si hay alumnos apuntados antes de eliminar
    const alumnosAfectados = clase.alumnosApuntados.length;
    if (alumnosAfectados > 0) {
      console.log(`Advertencia: Se eliminará la clase "${clase.nombre}" con ${alumnosAfectados} alumno(s) inscrito(s)`);
    }
    
    await Clase.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Clase eliminada correctamente',
      claseEliminada: {
        _id: clase._id,
        nombre: clase.nombre,
        alumnosAfectados
      }
    });
  } catch (error) {
    console.error('Error al eliminar clase:', error);
    res.status(500).json({ 
      message: 'Error al eliminar clase', 
      error: error.message 
    });
  }
};

/**
 * POST /api/clases/:id/inscribir
 * Inscribir al usuario autenticado en una clase
 * Acceso: usuarios autenticados
 */
const inscribirseEnClase = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const claseId = req.params.id;
    
    const clase = await Clase.findById(claseId);
    
    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }
    
    if (!clase.activa) {
      return res.status(400).json({ message: 'Esta clase no está activa' });
    }
    
    // Verificar si ya está apuntado
    if (clase.estaApuntado(usuarioId)) {
      return res.status(400).json({ message: 'Ya estás inscrito en esta clase' });
    }
    
    // Verificar si hay cupos disponibles
    if (clase.alumnosApuntados.length >= clase.cupoMaximo) {
      return res.status(400).json({ 
        message: 'La clase está llena',
        cupoMaximo: clase.cupoMaximo,
        alumnosApuntados: clase.alumnosApuntados.length
      });
    }
    
    // Verificar que el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Agregar usuario a la clase
    clase.alumnosApuntados.push(usuarioId);
    await clase.save();
    
    res.json({ 
      message: `Te has inscrito exitosamente en ${clase.nombre}`,
      clase: {
        _id: clase._id,
        nombre: clase.nombre,
        diaSemana: clase.diaSemana,
        horaInicio: clase.horaInicio,
        horaFin: clase.horaFin,
        plazasDisponibles: clase.cupoMaximo - clase.alumnosApuntados.length
      }
    });
  } catch (error) {
    console.error('Error al inscribirse en la clase:', error);
    res.status(500).json({ 
      message: 'Error al inscribirse en la clase', 
      error: error.message 
    });
  }
};

//DELETE
const desinscribirseDeClase = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const claseId = req.params.id;
    
    const clase = await Clase.findById(claseId);
    
    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }
    
    // Verificar si está apuntado
    if (!clase.estaApuntado(usuarioId)) {
      return res.status(400).json({ message: 'No estás inscrito en esta clase' });
    }
    
    // Remover usuario de la clase
    clase.alumnosApuntados = clase.alumnosApuntados.filter(
      id => id.toString() !== usuarioId.toString()
    );
    await clase.save();
    
    res.json({ 
      message: `Te has desinscrito correctamente de ${clase.nombre}`,
      clase: {
        _id: clase._id,
        nombre: clase.nombre,
        plazasDisponibles: clase.cupoMaximo - clase.alumnosApuntados.length
      }
    });
  } catch (error) {
    console.error('Error al desinscribirse de la clase:', error);
    res.status(500).json({ 
      message: 'Error al desinscribirse de la clase', 
      error: error.message 
    });
  }
};

//Obtener listado de inscritos
const getAlumnosClase = async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.id)
      .populate('alumnosApuntados', 'nombre email edad objetivo');
    
    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }
    
    res.json({
      clase: {
        _id: clase._id,
        nombre: clase.nombre,
        diaSemana: clase.diaSemana,
        horaInicio: clase.horaInicio,
        cupoMaximo: clase.cupoMaximo
      },
      totalAlumnos: clase.alumnosApuntados.length,
      plazasDisponibles: clase.cupoMaximo - clase.alumnosApuntados.length,
      alumnos: clase.alumnosApuntados
    });
  } catch (error) {
    console.error('Error al obtener alumnos de la clase:', error);
    res.status(500).json({ 
      message: 'Error al obtener alumnos de la clase', 
      error: error.message 
    });
  }
};

module.exports = {getClases,getClaseById,getMisClases,createClase,updateClase,deleteClase,inscribirseEnClase,desinscribirseDeClase,getAlumnosClase};
