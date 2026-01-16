
//Importar todas las librerías necesarias
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const path = require('path');
const connectDB = require("./config/db"); // Conexión a MongoDB
const mongoose = require('mongoose');

// Crear la aplicación Express y conectar a la base de datos MongoDB
const app = express();
connectDB();

//Middleware para procesar datos JSON en las peticiones
app.use(express.json());
// Servir archivos est\u00e1ticos (im\u00e1genes de ejercicios)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware para logging de peticiones (útil para debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

//Importar las rutas (solo usuarios y autenticación en esta fase)
const rutasUsuarios = require('./routes/userRoutes');
const rutasAutenticacion = require('./routes/authRoutes');
const rutasClases = require('./routes/claseRoutes');
const rutasEjercicios = require('./routes/ejercicioRoutes');
const rutasGuias = require('./routes/guiaRoutes');
const rutasStats = require('./routes/statsRoutes');

//Configurar las rutas de la API
// /api/users
app.use('/api/users', rutasUsuarios);
// /api/auth  
app.use('/api/auth', rutasAutenticacion);
// /api/clases
app.use('/api/clases', rutasClases);
// /api/ejercicios
app.use('/api/ejercicios', rutasEjercicios);
// /api/guias
app.use('/api/guias', rutasGuias);
// /api/stats
app.use('/api/stats', rutasStats);

// En desarrollo, el frontend corre en Vite (puerto 3000)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend-react/dist')));
  
  app.get('*', (peticion, respuesta) => {
    if (!peticion.path.startsWith('/api')) {
      respuesta.sendFile(path.join(__dirname, '../frontend-react/dist/index.html'));
    } else {
      respuesta.status(404).json({ message: 'Endpoint no encontrado' });
    }
  });
} else {
  // En desarrollo, solo manejar rutas de API no encontradas
  app.use('*', (peticion, respuesta) => {
    if (peticion.path.startsWith('/api')) {
      respuesta.status(404).json({ message: 'Endpoint de API no encontrado' });
    } else {
      respuesta.status(404).json({ message: 'El frontend corre en http://localhost:3000' });
    }
  });
}

//Configurar el puerto del servidor 
const PORT = process.env.PORT || 5001;

// Arrancar el servidor y manejar posibles errores
const servidor = app.listen(PORT, () => {
  console.log(` Servidor Fase 1 iniciado en http://localhost:${PORT}`);
});

// Manejar error si el PORT ya está ocupado
servidor.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(` El PORT ${PORT} ya está en uso.`);
    console.error(` Puedes cambiar el PORT o cerrar el proceso que lo usa`);
    // Esto lo añado porque es un problema que me pasaba a mí y lo tenía que utilizar
    // Para conocer más rápido el error 
    console.error(` Buscar proceso: netstat -ano | findstr :${PORT}`);   
    process.exit(1);
  }
  throw error;
});

// Funciones para cerrar el servidor correctamente (graceful shutdown)
const cerrarServidor = async (señal) => {
  console.log(`Recibida señal ${señal}. Cerrando servidor...`);
  servidor.close(async () => {
    console.log(' Servidor cerrado correctamente.');
    try {
      await mongoose.connection.close();
      console.log(' Conexión a MongoDB cerrada.');
    } catch (error) {
      console.error('Error al cerrar MongoDB:', error.message);
    }
    
    if (señal === 'SIGUSR2') {
      // Permitir que nodemon reinicie el servidor
      process.kill(process.pid, 'SIGUSR2');
    } else {
      process.exit(0);
    }
  });
};

// Escuchar señales del sistema para cerrar correctamente. Buscado para solucionar errores de cierre de procesos
// que me daban problemas al volver a iniciar el servidor con nodemon
process.once('SIGUSR2', () => cerrarServidor('SIGUSR2')); //nodemon reiniciar el servidor sin errores
process.on('SIGINT', () => cerrarServidor('SIGINT')); //cerrar bien la conexión