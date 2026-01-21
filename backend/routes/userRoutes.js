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

//Autenticar un usuario 
router.post('/login', loginUser);
//Crear un nuevo usuario 
router.post('/', createUser);
//Obtener perfil del usuario autenticado 
router.get('/profile', authenticateJWT, getProfile);
//Actualizar perfil del usuario autenticado 
router.put('/profile', authenticateJWT, updateProfile);
//Obtener todos los usuarios 
router.get('/', authenticateJWT, requireAdmin, getUsers);
//Actualizar usuario por ID 
router.put('/:id', authenticateJWT, updateUser);
//Eliminar cuenta propia 
router.delete('/me', authenticateJWT, deleteMyAccount);
//Eliminar un usuario por ID 
router.delete('/:id', authenticateJWT, requireAdmin, deleteUser);

module.exports = router;