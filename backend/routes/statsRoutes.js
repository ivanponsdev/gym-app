const express = require('express')
const router = express.Router()
const { authenticateJWT, requireAdmin } = require('../middleware/auth')
const statsController = require('../controllers/statsController')

// Ruta para obtener estadísticas globales Admin
router.get('/global', authenticateJWT, requireAdmin, statsController.obtenerEstadisticasGlobales)

module.exports = router
