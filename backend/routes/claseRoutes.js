const express = require('express');
const router = express.Router();
const { 
  getClases,
  getClaseById,
  getMisClases,
  createClase,
  updateClase,
  deleteClase,
  inscribirseEnClase,
  desinscribirseDeClase,
  getAlumnosClase
} = require('../controllers/claseController');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');


router.get('/', authenticateJWT, getClases);
router.get('/mias/listado', authenticateJWT, getMisClases);
router.get('/:id', authenticateJWT, getClaseById);
router.post('/:id/inscribir', authenticateJWT, inscribirseEnClase);
router.delete('/:id/desinscribir', authenticateJWT, desinscribirseDeClase);
router.post('/', authenticateJWT, requireAdmin, createClase);
router.put('/:id', authenticateJWT, requireAdmin, updateClase);
router.delete('/:id', authenticateJWT, requireAdmin, deleteClase);
router.get('/:id/alumnos', authenticateJWT, requireAdmin, getAlumnosClase);

module.exports = router;
