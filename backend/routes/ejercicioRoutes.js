const express = require('express');
const router = express.Router();
const {
  obtenerTodos,
  obtenerPorGrupo,
  obtenerPorEquipamiento,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
} = require('../controllers/ejercicioController');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

//Rutas públicas (Requieren autenticación)
// GET /api/ejercicios - Obtener todos los ejercicios
router.get('/', authenticateJWT, obtenerTodos);

// GET /api/ejercicios/grupo/:grupoMuscular  Filtrar por grupo muscular
router.get('/grupo/:grupoMuscular', authenticateJWT, obtenerPorGrupo);

// GET /api/ejercicios/equipamiento/:tipo  Filtrar por equipamiento (casa/gimnasio)
router.get('/equipamiento/:tipo', authenticateJWT, obtenerPorEquipamiento);

// GET /api/ejercicios/:id - Obtener ejercicio específico
router.get('/:id', authenticateJWT, obtenerPorId);

//Rutas protegidas (Solo administradores)
// POST /api/ejercicios - Crear nuevo ejercicio
router.post('/', authenticateJWT, requireAdmin, crear);

// PUT /api/ejercicios/:id - Actualizar ejercicio
router.put('/:id', authenticateJWT, requireAdmin, actualizar);

// DELETE /api/ejercicios/:id - Eliminar ejercicio
router.delete('/:id', authenticateJWT, requireAdmin, eliminar);

module.exports = router;
