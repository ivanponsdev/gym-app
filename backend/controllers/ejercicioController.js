const Ejercicio = require('../models/Ejercicio');

//Obtener ejercicios
const obtenerTodos = async (req, res) => {
  try {
    const ejercicios = await Ejercicio.find().sort({ grupoMuscular: 1, nombre: 1 });
    res.json(ejercicios);
  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    res.status(500).json({ message: 'Error al obtener ejercicios', error: error.message });
  }
};

//obtener por grupo muscular
const obtenerPorGrupo = async (req, res) => {
  try {
    const { grupoMuscular } = req.params;
    const ejercicios = await Ejercicio.find({ grupoMuscular }).sort({ nombre: 1 });
    
    if (ejercicios.length === 0) {
      return res.status(404).json({ message: `No se encontraron ejercicios para el grupo: ${grupoMuscular}` });
    }
    
    res.json(ejercicios);
  } catch (error) {
    console.error('Error al obtener ejercicios por grupo:', error);
    res.status(500).json({ message: 'Error al obtener ejercicios', error: error.message });
  }
};

//obtener por equipamiento
const obtenerPorEquipamiento = async (req, res) => {
  try {
    const { tipo } = req.params;
    const ejercicios = await Ejercicio.find({ equipamiento: tipo }).sort({ grupoMuscular: 1, nombre: 1 });
    
    if (ejercicios.length === 0) {
      return res.status(404).json({ message: `No se encontraron ejercicios para equipamiento: ${tipo}` });
    }
    
    res.json(ejercicios);
  } catch (error) {
    console.error('Error al obtener ejercicios por equipamiento:', error);
    res.status(500).json({ message: 'Error al obtener ejercicios', error: error.message });
  }
};

//obtener por id
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ejercicio = await Ejercicio.findById(id);
    
    if (!ejercicio) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
    
    res.json(ejercicio);
  } catch (error) {
    console.error('Error al obtener ejercicio:', error);
    res.status(500).json({ message: 'Error al obtener ejercicio', error: error.message });
  }
};

//Crear ejercicio
const crear = async (req, res) => {
  try {
    const { nombre, descripcion, grupoMuscular, dificultad, equipamiento } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !grupoMuscular || !dificultad || !equipamiento) {
      return res.status(400).json({ 
        message: 'Faltan campos obligatorios: nombre, grupoMuscular, dificultad, equipamiento' 
      });
    }
    
    // Verificar si ya existe un ejercicio con ese nombre
    const ejercicioExistente = await Ejercicio.findOne({ nombre });
    if (ejercicioExistente) {
      return res.status(400).json({ message: 'Ya existe un ejercicio con ese nombre' });
    }
    
    const nuevoEjercicio = new Ejercicio({
      nombre,
      descripcion,
      grupoMuscular,
      dificultad,
      equipamiento,
      imagenTecnica: req.file ? `/uploads/ejercicios/${req.file.filename}` : ''
    });
    
    await nuevoEjercicio.save();
    res.status(201).json({ message: 'Ejercicio creado correctamente', ejercicio: nuevoEjercicio });
  } catch (error) {
    console.error('Error al crear ejercicio:', error);
    res.status(500).json({ message: 'Error al crear ejercicio', error: error.message });
  }
};

//Actualizar
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, grupoMuscular, dificultad, equipamiento } = req.body;
    
    // Verificar si el ejercicio existe
    const ejercicio = await Ejercicio.findById(id);
    if (!ejercicio) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
    
    // Si se cambia el nombre, verificar que no exista otro con ese nombre
    if (nombre && nombre !== ejercicio.nombre) {
      const ejercicioConNombre = await Ejercicio.findOne({ nombre });
      if (ejercicioConNombre) {
        return res.status(400).json({ message: 'Ya existe un ejercicio con ese nombre' });
      }
    }
    
    // Actualizar campos
    if (nombre) ejercicio.nombre = nombre;
    if (descripcion !== undefined) ejercicio.descripcion = descripcion;
    if (grupoMuscular) ejercicio.grupoMuscular = grupoMuscular;
    if (dificultad) ejercicio.dificultad = dificultad;
    if (equipamiento) ejercicio.equipamiento = equipamiento;
    if (req.file) ejercicio.imagenTecnica = `/uploads/ejercicios/${req.file.filename}`;
    
    await ejercicio.save();
    res.json({ message: 'Ejercicio actualizado correctamente', ejercicio });
  } catch (error) {
    console.error('Error al actualizar ejercicio:', error);
    res.status(500).json({ message: 'Error al actualizar ejercicio', error: error.message });
  }
};

//Eliminar
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ejercicio = await Ejercicio.findByIdAndDelete(id);
    
    if (!ejercicio) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
    
    res.json({ message: 'Ejercicio eliminado correctamente', ejercicio });
  } catch (error) {
    console.error('Error al eliminar ejercicio:', error);
    res.status(500).json({ message: 'Error al eliminar ejercicio', error: error.message });
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorGrupo,
  obtenerPorEquipamiento,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
