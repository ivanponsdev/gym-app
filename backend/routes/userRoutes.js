const express = require('express');
const router = express.Router();
const { 
  loginUser,
  getUsers, 
  createUser,
  updateUser,
  deleteUser,
  deleteMyAccount,
  getProfile,
  updateProfile
} = require('../controllers/userController');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

//Autenticar un usuario (público)
router.post('/login', loginUser);
//Crear un nuevo usuario (público)
router.post('/', createUser);
//Obtener perfil del usuario autenticado (protegido)
router.get('/profile', authenticateJWT, getProfile);
//Actualizar perfil del usuario autenticado (protegido)
router.put('/profile', authenticateJWT, updateProfile);
//Obtener todos los usuarios (protegido - solo admin)
router.get('/', authenticateJWT, requireAdmin, getUsers);
//Actualizar usuario por ID (protegido - usuario autenticado)
router.put('/:id', authenticateJWT, updateUser);
//Eliminar cuenta propia (protegido - usuario autenticado)
router.delete('/me', authenticateJWT, deleteMyAccount);
//Eliminar un usuario por ID (protegido - solo admin)
router.delete('/:id', authenticateJWT, requireAdmin, deleteUser);

module.exports = router;