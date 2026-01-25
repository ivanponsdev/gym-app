const Usuario = require('../models/Usuario');
const Clase = require('../models/Clase');

let Stats;
try {
  Stats = require('../models/Stats');
} catch (e) {
  Stats = null;
}

exports.getExportUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al exportar usuarios' });
  }
};

exports.getExportClasses = async (req, res) => {
  try {
    const clases = await Clase.find({});
    res.json(clases);
  } catch (error) {
    res.status(500).json({ error: 'Error al exportar clases' });
  }
};

exports.getExportStats = async (req, res) => {
  if (!Stats) {
    return res.status(404).json({ error: 'Modelo de estadísticas no encontrado' });
  }
  try {
    const stats = await Stats.find({});
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al exportar estadísticas' });
  }
};
