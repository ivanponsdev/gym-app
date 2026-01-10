const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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

// Configuración de multer para subir imágenes de ejercicios
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/ejercicios/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ejercicio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

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
router.post('/', authenticateJWT, requireAdmin, upload.single('imagenTecnica'), crear);

// PUT /api/ejercicios/:id - Actualizar ejercicio
router.put('/:id', authenticateJWT, requireAdmin, upload.single('imagenTecnica'), actualizar);

// DELETE /api/ejercicios/:id - Eliminar ejercicio
router.delete('/:id', authenticateJWT, requireAdmin, eliminar);

module.exports = router;
