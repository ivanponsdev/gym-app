const Guia = require('../models/Guia');
const fs = require('fs'); //manipular archivos desde el servidor

// Obtener todas las guías (solo admin)
const obtenerTodas = async (req, res) => {
  try {
    const guias = await Guia.find().sort({ createdAt: -1 });
    res.json(guias);
  } catch (error) {
    console.error('Error al obtener guías:', error);
    res.status(500).json({ message: 'Error al obtener guías', error: error.message });
  }
};

// Obtener guías filtradas por objetivo del usuario autenticado
const obtenerMisGuias = async (req, res) => {
  try {
    const objetivoUsuario = req.user.objetivo;
    
    // Si el usuario no tiene objetivo configurado, mostrar solo las guías generales
    const filtro = objetivoUsuario 
      ? {
          activa: true,
          $or: [
            { objetivo: objetivoUsuario },
            { objetivo: 'todos' }
          ]
        }
      : {
          activa: true,
          objetivo: 'todos'
        };
    
    const guias = await Guia.find(filtro).sort({ createdAt: -1 });
    
    res.json(guias);
  } catch (error) {
    console.error('Error al obtener guías del usuario:', error);
    res.status(500).json({ message: 'Error al obtener guías', error: error.message });
  }
};

// Obtener guía por ID
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const guia = await Guia.findById(id);
    
    if (!guia) {
      return res.status(404).json({ message: 'Guía no encontrada' });
    }
    
    res.json(guia);
  } catch (error) {
    console.error('Error al obtener guía:', error);
    res.status(500).json({ message: 'Error al obtener guía', error: error.message });
  }
};

// Crear nueva guía (admin)
const crear = async (req, res) => {
  try {
    const { titulo, descripcion, objetivo, activa } = req.body;
    
    // Validar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({ message: 'Debe subir un archivo PDF' });
    }
    
    const nuevaGuia = new Guia({
      titulo,
      descripcion,
      objetivo,
      archivoUrl: req.file.path,
      activa: activa !== undefined ? activa : true
    });
    
    await nuevaGuia.save();
    res.status(201).json({ message: 'Guía creada exitosamente', guia: nuevaGuia });
  } catch (error) {
    // Si hay error, eliminar el archivo subido
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error al crear guía:', error);
    res.status(500).json({ message: 'Error al crear guía', error: error.message });
  }
};

// Actualizar guía (admin)
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, objetivo, activa } = req.body;
    
    const guia = await Guia.findById(id);
    if (!guia) {
      // Si hay un archivo nuevo, eliminarlo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Guía no encontrada' });
    }
    
    // Actualizar campos
    guia.titulo = titulo || guia.titulo;
    guia.descripcion = descripcion !== undefined ? descripcion : guia.descripcion;
    guia.objetivo = objetivo || guia.objetivo;
    guia.activa = activa !== undefined ? activa : guia.activa;
    
    // Si se subió un nuevo archivo PDF
    if (req.file) {
      // Eliminar archivo anterior
      if (guia.archivoUrl && fs.existsSync(guia.archivoUrl)) {
        fs.unlinkSync(guia.archivoUrl);
      }
      guia.archivoUrl = req.file.path;
    }
    
    await guia.save();
    res.json({ message: 'Guía actualizada exitosamente', guia });
  } catch (error) {
    // Si hay error y se subió un archivo nuevo, eliminarlo
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error al actualizar guía:', error);
    res.status(500).json({ message: 'Error al actualizar guía', error: error.message });
  }
};

// Eliminar guía (admin)
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const guia = await Guia.findById(id);
    
    if (!guia) {
      return res.status(404).json({ message: 'Guía no encontrada' });
    }
    
    // Eliminar archivo PDF del servidor
    if (guia.archivoUrl && fs.existsSync(guia.archivoUrl)) {
      fs.unlinkSync(guia.archivoUrl);
    }
    
    await Guia.findByIdAndDelete(id);
    res.json({ message: 'Guía eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar guía:', error);
    res.status(500).json({ message: 'Error al eliminar guía', error: error.message });
  }
};

module.exports = {obtenerTodas,obtenerMisGuias,obtenerPorId,crear,actualizar,eliminar};
