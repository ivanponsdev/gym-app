const express = require('express');
const router = express.Router();

// Importar funciones del controlador de usuarios
const { loginUser, createUser } = require('../controllers/userController');

router.post('/login', loginUser);

// POST /api/auth/register  
router.post('/register', createUser);

module.exports = router;