const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  obtenerTodas,
  obtenerMisGuias,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
} = require('../controllers/guiaController');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

// Configuración de multer para subir PDFs de guías
const storage = multer.diskStorage({ //configura almacenamiento para multer
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/guias/'); //Se define donde se guardan los archivos sin errores.
  }, //null indica que no hay error.

  filename: function (req, file, cb) { //Define como llamaremos al archivo. Fecha más número aleatorio
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); 
    //genera un número entre 0 y 1, lo multiplica por 1 billón y lo redondea para tener un número entero.

    cb(null, 'guia-' + uniqueSuffix + path.extname(file.originalname));
  }
});    //Con esta combinación se asegura que no se repita el nombre.

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/pdf';
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  fileFilter: fileFilter
});

// Rutas protegidas (Solo administradores)
// GET /api/guias - Obtener todas
router.get('/', authenticateJWT, requireAdmin, obtenerTodas);
// POST /api/guias - Crear nueva 
router.post('/', authenticateJWT, requireAdmin, upload.single('archivoPdf'), crear);

// Rutas para usuarios autenticados (DESPUÉS de las rutas admin específicas)
// GET /api/guias/mis-guias - Obtener guías filtradas por objetivo
router.get('/mis-guias', authenticateJWT, obtenerMisGuias);

// Rutas con parámetros dinámicos al final
// GET /api/guias/:id - Obtener guía por ID
router.get('/:id', authenticateJWT, obtenerPorId);
// PUT /api/guias/:id - Actualizar
router.put('/:id', authenticateJWT, requireAdmin, upload.single('archivoPdf'), actualizar);
// DELETE /api/guias/:id - Eliminar
router.delete('/:id', authenticateJWT, requireAdmin, eliminar);

module.exports = router;
