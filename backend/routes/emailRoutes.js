const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { authenticateJWT } = require('../middleware/auth');

// Enviar guías por email (requiere autenticación)
router.post('/send-guides', authenticateJWT, emailController.sendGuidesEmail);

// Obtener estado del último envío
router.get('/status', authenticateJWT, emailController.getLastEmailStatus);

module.exports = router;
