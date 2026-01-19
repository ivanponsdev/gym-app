# PLAN DE PRUEBAS - ULTIMATE GYM
## Aplicación de Gestión de Gimnasio
### Fecha: Enero 2026
### Versión: 1.0

---

## 📋 ÍNDICE
1. [Descripción General](#descripción-general)
2. [Funcionalidades de la Aplicación](#funcionalidades-de-la-aplicación)
3. [Estrategia de Pruebas](#estrategia-de-pruebas)
4. [Casos de Prueba Detallados](#casos-de-prueba-detallados)
5. [Checklist de Pruebas](#checklist-de-pruebas)

---

## 📝 DESCRIPCIÓN GENERAL

**Ultimate Gym** es una aplicación web full-stack para la gestión de un gimnasio que incluye:
- Sistema de autenticación con JWT
- Gestión de usuarios (Normales y Administradores)
- Calendario de clases con sistema de inscripciones
- Biblioteca de ejercicios con imágenes
- Guías de entrenamiento personalizadas por objetivo
- Dashboard estadístico para administradores
- Asistente virtual (Landbot chatbot)

**Stack Tecnológico:**
- Backend: Node.js + Express + MongoDB
- Frontend: React 19 + Vite
- Autenticación: JWT + bcrypt
- Uploads: Multer (imágenes/PDFs)

---

## 🎯 FUNCIONALIDADES DE LA APLICACIÓN

### 1. AUTENTICACIÓN Y USUARIOS

#### 1.1 Registro de Usuario
- Endpoint: `POST /api/auth/register`
- Campos: nombre, email, password, edad, sexo, objetivo, objetivoClasesSemana
- Validaciones: edad (14-100), email único, password hash

#### 1.2 Login de Usuario
- Endpoint: `POST /api/auth/login` y `POST /api/users/login`
- Respuesta: Token JWT + datos usuario
- Roles: 'user' o 'admin'

#### 1.3 Gestión de Perfil
- Ver perfil: `GET /api/users/profile`
- Actualizar perfil: `PUT /api/users/profile`
- Eliminar cuenta propia: `DELETE /api/users/me`

#### 1.4 Gestión de Usuarios (Admin)
- Listar todos: `GET /api/users`
- Crear usuario: `POST /api/users`
- Actualizar usuario: `PUT /api/users/:id`
- Eliminar usuario: `DELETE /api/users/:id`

---

### 2. CLASES

#### 2.1 Visualización de Clases
- Obtener todas: `GET /api/clases`
- Vista semanal organizada por días
- Colores por tipo: spinning, yoga, crossfit, pilates, zumba

#### 2.2 Mis Clases
- Listar mis inscripciones: `GET /api/clases/mias/listado`
- Vista semanal con objetivo semanal de clases

#### 2.3 Inscripciones
- Inscribirse: `POST /api/clases/:id/inscribir`
- Validaciones: cupo disponible, no inscrito previamente, clase activa
- Desinscribirse: `DELETE /api/clases/:id/desinscribir`

#### 2.4 Gestión de Clases (Admin)
- Crear clase: `POST /api/clases`
- Campos: nombre, descripción, diaSemana, horaInicio, horaFin, profesor, cupoMaximo, activa
- Actualizar: `PUT /api/clases/:id`
- Eliminar: `DELETE /api/clases/:id`
- Ver alumnos: `GET /api/clases/:id/alumnos`

---

### 3. EJERCICIOS

#### 3.1 Biblioteca de Ejercicios
- Listar todos: `GET /api/ejercicios`
- Filtrar por grupo muscular: `GET /api/ejercicios/grupo/:grupoMuscular`
- Filtrar por equipamiento: `GET /api/ejercicios/equipamiento/:equipamiento`
- Ver detalle: `GET /api/ejercicios/:id`

#### 3.2 Gestión de Ejercicios (Admin)
- Crear: `POST /api/ejercicios` (con imagen)
- Campos: nombre, descripción, grupoMuscular, dificultad, equipamiento, imagenTecnica
- Actualizar: `PUT /api/ejercicios/:id` (con imagen opcional)
- Eliminar: `DELETE /api/ejercicios/:id` (elimina imagen del servidor)

---

### 4. GUÍAS DE ENTRENAMIENTO

#### 4.1 Mis Guías
- Listar mis guías: `GET /api/guias/mis-guias`
- Filtrado automático por objetivo del usuario
- Guías generales (objetivo: 'todos') visibles para todos

#### 4.2 Gestión de Guías (Admin)
- Listar todas: `GET /api/guias`
- Crear: `POST /api/guias` (con PDF)
- Campos: titulo, descripcion, objetivo, activa, archivoPdf
- Actualizar: `PUT /api/guias/:id` (con PDF opcional)
- Eliminar: `DELETE /api/guias/:id` (elimina PDF del servidor)

---

### 5. ESTADÍSTICAS (Admin)

#### 5.1 Dashboard Estadístico
- Endpoint: `GET /api/stats/global`
- Métricas:
  - Total usuarios activos
  - Total clases activas
  - Total ejercicios
  - Total guías
  - Clases más populares (por inscritos)
  - Total de inscripciones
  - Distribución por objetivos
  - Distribución por edad
  - Distribución por sexo

---

### 6. INTERFAZ Y EXPERIENCIA DE USUARIO

#### 6.1 Landing Page
- Botón "Comenzar" → Auth
- Botón "Información" → Info Page
- Logo flotante animado

#### 6.2 Página Info
- Información del gimnasio
- Horarios
- Tarifas
- Promociones

#### 6.3 Auth (Login/Registro)
- Formulario dual con switch
- Validación en tiempo real
- Manejo de errores

#### 6.4 Dashboard Usuario
- Secciones: Perfil, Clases, Mis Clases, Ejercicios, Guías, Asistente Virtual
- Sidebar con navegación
- Modales personalizados
- Notificaciones

#### 6.5 Dashboard Admin
- Vista de estadísticas con gráficos (Recharts)
- Gestión CRUD completa de usuarios, clases, ejercicios, guías
- Tablas con acciones (editar/eliminar)

#### 6.6 Asistente Virtual (Landbot)
- Desktop: Modo embebido en dashboard
- Móvil: Modo popup flotante (botón manual)
- Posicionamiento: superior izquierda en móvil

#### 6.7 Responsive Design
- Breakpoint principal: 768px
- Header móvil con botones de sesión
- Navegación inferior en móvil
- Calendario adaptable a grid

---

## 🧪 ESTRATEGIA DE PRUEBAS

### Tipos de Pruebas a Realizar

1. **Pruebas Funcionales** - Verificar que cada funcionalidad trabaje según especificación
2. **Pruebas de Integración** - Verificar comunicación Frontend-Backend-Base de datos
3. **Pruebas de Seguridad** - Validar autenticación, autorización, y protección de rutas
4. **Pruebas de UI/UX** - Verificar interfaz, navegación, y responsive
5. **Pruebas de Validación** - Verificar validaciones de datos (edad, email, horarios, etc.)
6. **Pruebas de Errores** - Verificar manejo de errores y mensajes al usuario

### Entornos de Prueba

- **Desarrollo:** `http://localhost:5001` (Backend) + `http://localhost:3000` (Frontend)
- **Base de datos:** MongoDB local o cloud (verificar conexión)

### Datos de Prueba

**Usuario Normal:**
- Email: usuario@test.com
- Password: test123
- Objetivo: aumento_masa_muscular

**Usuario Admin:**
- Email: admin@test.com
- Password: admin123
- Role: admin

---

## 📝 CASOS DE PRUEBA DETALLADOS

### 🔐 MÓDULO 1: AUTENTICACIÓN Y SEGURIDAD

#### CP-001: Registro de Usuario Exitoso
**Precondiciones:** No existe usuario con el email
**Pasos:**
1. Navegar a `/` y hacer clic en "Comenzar"
2. Cambiar a pestaña "Registro"
3. Ingresar: nombre, email único, password, edad (14-100), sexo, objetivo
4. Hacer clic en "Registrar"

**Resultado Esperado:**
- ✅ Usuario creado en base de datos
- ✅ Redirige a dashboard
- ✅ Token JWT almacenado en localStorage
- ✅ Mensaje de éxito

**Resultado Real:** _________

---

#### CP-002: Registro con Email Duplicado
**Pasos:**
1. Intentar registrar usuario con email ya existente

**Resultado Esperado:**
- ❌ Error 400: "El email ya está registrado"
- ❌ No se crea usuario duplicado

**Resultado Real:** _________

---

#### CP-003: Registro con Edad Inválida
**Pasos:**
1. Intentar registrar con edad < 14 o > 100

**Resultado Esperado:**
- ❌ Error de validación
- ❌ Mensaje: "La edad debe estar entre 14 y 100 años"

**Resultado Real:** _________

---

#### CP-004: Login Exitoso
**Pasos:**
1. Navegar a Auth
2. Ingresar email y password correctos
3. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Token JWT generado
- ✅ Redirige a dashboard correspondiente (user/admin)
- ✅ Datos del usuario en contexto AuthContext

**Resultado Real:** _________

---

#### CP-005: Login con Credenciales Incorrectas
**Pasos:**
1. Ingresar email o password incorrectos

**Resultado Esperado:**
- ❌ Error 401: "Email o contraseña incorrectos"
- ❌ No se genera token

**Resultado Real:** _________

---

#### CP-006: Protección de Rutas
**Pasos:**
1. Sin token, intentar acceder a: `/dashboard`, `/admin`
2. Con token de usuario normal, intentar acceder a: `/admin`

**Resultado Esperado:**
- ❌ Redirige a `/` (login) si no hay token
- ❌ Error 403 si usuario sin permisos intenta acceder a rutas admin

**Resultado Real:** _________

---

#### CP-007: Logout
**Pasos:**
1. Hacer clic en "Cerrar Sesión"

**Resultado Esperado:**
- ✅ Token eliminado de localStorage
- ✅ Contexto de usuario limpiado
- ✅ Redirige a landing page

**Resultado Real:** _________

---

### 👤 MÓDULO 2: GESTIÓN DE PERFIL

#### CP-008: Ver Perfil Propio
**Precondiciones:** Usuario autenticado
**Pasos:**
1. En dashboard, ir a sección "Perfil"

**Resultado Esperado:**
- ✅ Muestra: nombre, email, edad, sexo, objetivo, objetivoClasesSemana, fecha de registro
- ✅ Botón "Editar Perfil"

**Resultado Real:** _________

---

#### CP-009: Actualizar Perfil
**Pasos:**
1. Hacer clic en "Editar Perfil"
2. Modificar: nombre, edad, objetivo, objetivoClasesSemana
3. Guardar

**Resultado Esperado:**
- ✅ Datos actualizados en base de datos
- ✅ Vista de perfil actualizada
- ✅ Mensaje: "Perfil actualizado correctamente"

**Resultado Real:** _________

---

#### CP-010: Cambiar Password
**Pasos:**
1. En edición de perfil, cambiar password
2. Guardar

**Resultado Esperado:**
- ✅ Password hasheado actualizado en BD
- ✅ Puede hacer login con nuevo password

**Resultado Real:** _________

---

#### CP-011: Eliminar Cuenta Propia
**Pasos:**
1. Usuario normal intenta eliminar su cuenta

**Resultado Esperado:**
- ✅ Usuario marcado con fechaBaja en BD
- ✅ Sesión cerrada automáticamente
- ✅ No puede hacer login nuevamente

**Resultado Real:** _________

---

### 📅 MÓDULO 3: CLASES - USUARIO NORMAL

#### CP-012: Ver Calendario de Clases
**Precondiciones:** Usuario autenticado
**Pasos:**
1. Ir a sección "Clases"

**Resultado Esperado:**
- ✅ Calendario semanal (Lunes-Domingo)
- ✅ Clases organizadas por día
- ✅ Información visible: nombre, hora, profesor, plazas disponibles
- ✅ Badge de disponibilidad (disponible/casi lleno/completo)
- ✅ Colores por tipo de clase

**Resultado Real:** _________

---

#### CP-013: Inscribirse en Clase con Plazas
**Pasos:**
1. Hacer clic en "Inscribirme" en una clase con plazas disponibles

**Resultado Esperado:**
- ✅ Usuario añadido a alumnosApuntados
- ✅ Plazas disponibles decrementadas
- ✅ Botón cambia a "Ya inscrito"
- ✅ Mensaje: "Te has inscrito correctamente"
- ✅ Clase aparece en "Mis Clases"

**Resultado Real:** _________

---

#### CP-014: Intentar Inscribirse en Clase Completa
**Pasos:**
1. Intentar inscribirse en clase sin plazas

**Resultado Esperado:**
- ❌ Error 400: "No hay plazas disponibles"
- ❌ No se añade usuario

**Resultado Real:** _________

---

#### CP-015: Intentar Inscribirse Dos Veces
**Pasos:**
1. Inscribirse en una clase
2. Intentar inscribirse nuevamente

**Resultado Esperado:**
- ❌ Error 400: "Ya estás inscrito en esta clase"
- ❌ Botón "Ya inscrito" deshabilitado

**Resultado Real:** _________

---

#### CP-016: Desinscribirse de Clase
**Pasos:**
1. En "Mis Clases", hacer clic en botón X (desinscribir)

**Resultado Esperado:**
- ✅ Usuario removido de alumnosApuntados
- ✅ Plazas disponibles incrementadas
- ✅ Clase desaparece de "Mis Clases"
- ✅ En calendario, botón vuelve a "Inscribirme"
- ✅ Mensaje: "Te has desinscrito correctamente"

**Resultado Real:** _________

---

#### CP-017: Ver Mis Clases Semanales
**Pasos:**
1. Ir a sección "Mis Clases"

**Resultado Esperado:**
- ✅ Vista semanal de clases inscritas
- ✅ Widget "Objetivo Semanal" con progreso (X/Y clases)
- ✅ Badge "HOY" en día actual
- ✅ Contador de clases por día

**Resultado Real:** _________

---

#### CP-018: Objetivo Semanal de Clases
**Pasos:**
1. Verificar widget de objetivo semanal

**Resultado Esperado:**
- ✅ Muestra: "X de Y clases completadas esta semana"
- ✅ Barra de progreso visual
- ✅ Y = objetivoClasesSemana del usuario

**Resultado Real:** _________

---

### 📅 MÓDULO 4: CLASES - ADMINISTRADOR

#### CP-019: Crear Nueva Clase
**Precondiciones:** Usuario admin autenticado
**Pasos:**
1. En AdminDashboard, sección "Clases"
2. Hacer clic en "Añadir Clase"
3. Llenar formulario: nombre, descripción, diaSemana, horaInicio, horaFin, profesor, cupoMaximo
4. Guardar

**Resultado Esperado:**
- ✅ Clase creada en base de datos
- ✅ Aparece en tabla de clases
- ✅ Visible para usuarios normales si activa=true
- ✅ Mensaje de confirmación

**Resultado Real:** _________

---

#### CP-020: Validación de Horarios
**Pasos:**
1. Intentar crear clase con horaFin <= horaInicio

**Resultado Esperado:**
- ❌ Error 400: "La hora de fin debe ser posterior a la hora de inicio"

**Resultado Real:** _________

---

#### CP-021: Editar Clase Existente
**Pasos:**
1. Hacer clic en icono de editar (✏️)
2. Modificar datos
3. Guardar

**Resultado Esperado:**
- ✅ Clase actualizada en BD
- ✅ Cambios reflejados en tabla y calendario
- ✅ Si hay alumnos inscritos, se mantienen

**Resultado Real:** _________

---

#### CP-022: Eliminar Clase
**Pasos:**
1. Hacer clic en icono eliminar (🗑️)
2. Confirmar eliminación

**Resultado Esperado:**
- ✅ Clase eliminada de BD
- ✅ Desaparece del calendario
- ✅ Usuarios inscritos ya no la ven en "Mis Clases"

**Resultado Real:** _________

---

#### CP-023: Ver Alumnos Inscritos en Clase
**Pasos:**
1. Hacer clic en clase para ver detalles
2. Ver listado de alumnos

**Resultado Esperado:**
- ✅ Lista con nombre, email, edad, objetivo de cada alumno
- ✅ Total de alumnos inscritos
- ✅ Plazas disponibles

**Resultado Real:** _________

---

### 💪 MÓDULO 5: EJERCICIOS

#### CP-024: Ver Biblioteca de Ejercicios
**Precondiciones:** Usuario autenticado
**Pasos:**
1. Ir a sección "Ejercicios"

**Resultado Esperado:**
- ✅ Grid de cards con ejercicios
- ✅ Cada card muestra: imagen, nombre, grupo muscular, dificultad, equipamiento
- ✅ Filtros por grupo muscular y equipamiento

**Resultado Real:** _________

---

#### CP-025: Filtrar por Grupo Muscular
**Pasos:**
1. Seleccionar grupo muscular en dropdown

**Resultado Esperado:**
- ✅ Solo muestra ejercicios del grupo seleccionado
- ✅ Opción "Todos" muestra todo

**Resultado Real:** _________

---

#### CP-026: Filtrar por Equipamiento
**Pasos:**
1. Seleccionar equipamiento en dropdown

**Resultado Esperado:**
- ✅ Solo muestra ejercicios con ese equipamiento
- ✅ Opción "Todos" muestra todo

**Resultado Real:** _________

---

#### CP-027: Ver Detalle de Ejercicio
**Pasos:**
1. Hacer clic en card de ejercicio

**Resultado Esperado:**
- ✅ Muestra descripción completa
- ✅ Imagen ampliada
- ✅ Todos los detalles técnicos

**Resultado Real:** _________

---

#### CP-028: Crear Ejercicio (Admin)
**Pasos:**
1. Admin: "Añadir Ejercicio"
2. Llenar: nombre, descripción, grupoMuscular, dificultad, equipamiento
3. Subir imagen (JPEG/PNG/GIF/WebP)
4. Guardar

**Resultado Esperado:**
- ✅ Ejercicio creado en BD
- ✅ Imagen guardada en `/backend/uploads/ejercicios/`
- ✅ Aparece en biblioteca
- ✅ Ruta de imagen en ejercicio.imagenTecnica

**Resultado Real:** _________

---

#### CP-029: Validación de Imagen en Ejercicio
**Pasos:**
1. Intentar subir archivo no válido (.txt, .pdf, etc.)

**Resultado Esperado:**
- ❌ Error: "Solo se permiten imágenes (JPEG, PNG, GIF, WebP)"
- ❌ No se guarda el ejercicio

**Resultado Real:** _________

---

#### CP-030: Editar Ejercicio (Admin)
**Pasos:**
1. Editar ejercicio existente
2. Cambiar imagen (opcional)

**Resultado Esperado:**
- ✅ Datos actualizados
- ✅ Si se cambia imagen: imagen anterior eliminada, nueva guardada

**Resultado Real:** _________

---

#### CP-031: Eliminar Ejercicio (Admin)
**Pasos:**
1. Eliminar ejercicio

**Resultado Esperado:**
- ✅ Ejercicio eliminado de BD
- ✅ Imagen eliminada del servidor
- ✅ Desaparece de biblioteca

**Resultado Real:** _________

---

### 📚 MÓDULO 6: GUÍAS DE ENTRENAMIENTO

#### CP-032: Ver Mis Guías
**Precondiciones:** Usuario con objetivo configurado
**Pasos:**
1. Ir a sección "Guías"

**Resultado Esperado:**
- ✅ Muestra guías con objetivo del usuario + guías generales (objetivo:'todos')
- ✅ Cards con: título, descripción, objetivo, badge de objetivo con color
- ✅ Botón "Ver PDF"

**Resultado Real:** _________

---

#### CP-033: Filtrado Automático por Objetivo
**Pasos:**
1. Usuario con objetivo "aumento_masa_muscular"

**Resultado Esperado:**
- ✅ Ve guías con objetivo: 'aumento_masa_muscular' + 'todos'
- ❌ No ve guías de otros objetivos

**Resultado Real:** _________

---

#### CP-034: Descargar Guía PDF
**Pasos:**
1. Hacer clic en "Ver PDF"

**Resultado Esperado:**
- ✅ Abre PDF en nueva pestaña o descarga según navegador
- ✅ PDF se sirve desde `/backend/uploads/guias/`

**Resultado Real:** _________

---

#### CP-035: Crear Guía (Admin)
**Pasos:**
1. Admin: "Añadir Guía"
2. Llenar: titulo, descripcion, objetivo (enum), activa (bool)
3. Subir PDF
4. Guardar

**Resultado Esperado:**
- ✅ Guía creada en BD
- ✅ PDF guardado en `/backend/uploads/guias/`
- ✅ Aparece en lista admin
- ✅ Visible para usuarios según objetivo y activa=true

**Resultado Real:** _________

---

#### CP-036: Validación de PDF
**Pasos:**
1. Intentar subir archivo no PDF

**Resultado Esperado:**
- ❌ Error: "Solo se permiten archivos PDF"
- ❌ No se guarda la guía

**Resultado Real:** _________

---

#### CP-037: Editar Guía (Admin)
**Pasos:**
1. Editar guía existente
2. Cambiar PDF (opcional)

**Resultado Esperado:**
- ✅ Guía actualizada
- ✅ Si se cambia PDF: PDF anterior eliminado, nuevo guardado

**Resultado Real:** _________

---

#### CP-038: Eliminar Guía (Admin)
**Pasos:**
1. Eliminar guía

**Resultado Esperado:**
- ✅ Guía eliminada de BD
- ✅ PDF eliminado del servidor
- ✅ Desaparece de listas

**Resultado Real:** _________

---

#### CP-039: Guías Inactivas
**Pasos:**
1. Admin marca guía como activa=false

**Resultado Esperado:**
- ❌ Usuarios normales no la ven
- ✅ Admin sigue viéndola en lista

**Resultado Real:** _________

---

### 👥 MÓDULO 7: GESTIÓN DE USUARIOS (Admin)

#### CP-040: Listar Todos los Usuarios
**Pasos:**
1. Admin: Ir a sección "Usuarios"

**Resultado Esperado:**
- ✅ Tabla con todos los usuarios
- ✅ Columnas: nombre, email, edad, sexo, objetivo, role, fecha registro
- ✅ Acciones: editar, eliminar

**Resultado Real:** _________

---

#### CP-041: Crear Usuario desde Admin
**Pasos:**
1. Admin: "Añadir Usuario"
2. Llenar datos + seleccionar role

**Resultado Esperado:**
- ✅ Usuario creado
- ✅ Puede asignar role: 'user' o 'admin'

**Resultado Real:** _________

---

#### CP-042: Editar Usuario
**Pasos:**
1. Admin edita usuario existente

**Resultado Esperado:**
- ✅ Puede cambiar todos los campos incluido role

**Resultado Real:** _________

---

#### CP-043: Eliminar Usuario
**Pasos:**
1. Admin elimina usuario

**Resultado Esperado:**
- ✅ Usuario marcado con fechaBaja
- ✅ No puede hacer login
- ✅ Se desinscribe automáticamente de clases

**Resultado Real:** _________

---

### 📊 MÓDULO 8: ESTADÍSTICAS (Admin)

#### CP-044: Dashboard de Estadísticas
**Pasos:**
1. Admin: Ver AdminDashboard al inicio

**Resultado Esperado:**
- ✅ Cards con: Total Usuarios, Total Clases, Total Ejercicios, Total Guías
- ✅ Gráfico: Clases más populares (bar chart)
- ✅ Gráfico: Distribución por objetivo (pie chart)
- ✅ Gráfico: Distribución por edad (line chart o bar chart)
- ✅ Gráfico: Distribución por sexo (pie chart)
- ✅ Total inscripciones globales

**Resultado Real:** _________

---

#### CP-045: Actualización de Estadísticas
**Pasos:**
1. Crear nuevo usuario/clase/ejercicio/guía
2. Refrescar dashboard

**Resultado Esperado:**
- ✅ Totales actualizados
- ✅ Gráficos actualizados

**Resultado Real:** _________

---

### 🎨 MÓDULO 9: INTERFAZ Y NAVEGACIÓN

#### CP-046: Landing Page
**Pasos:**
1. Navegar a `/`

**Resultado Esperado:**
- ✅ Logo "ULTIMATE GYM" con gradiente neón
- ✅ Botón "Comenzar"
- ✅ Botón "Información"
- ✅ Logo flotante animado en esquina superior derecha

**Resultado Real:** _________

---

#### CP-047: Página Info
**Pasos:**
1. Hacer clic en "Información"

**Resultado Esperado:**
- ✅ Información del gimnasio
- ✅ Botón "Volver" funcional

**Resultado Real:** _________

---

#### CP-048: Sidebar Navegación (Desktop)
**Precondiciones:** Usuario en dashboard
**Pasos:**
1. Verificar sidebar izquierdo

**Resultado Esperado:**
- ✅ Logo en top
- ✅ Secciones: Perfil, Clases, Mis Clases, Ejercicios, Guías, Asistente Virtual
- ✅ Botones: Cerrar Sesión, Salir
- ✅ Sección activa resaltada
- ✅ Animaciones hover

**Resultado Real:** _________

---

#### CP-049: Navegación Móvil (Mobile)
**Pasos:**
1. Reducir ventana a <768px

**Resultado Esperado:**
- ✅ Sidebar se convierte en navegación inferior fija
- ✅ Logo oculto en móvil
- ✅ Botones "Cerrar Sesión" y "Salir" en header superior
- ✅ Iconos de secciones en navegación inferior

**Resultado Real:** _________

---

#### CP-050: Modales Personalizados
**Pasos:**
1. Realizar acción que dispare modal (inscribir, editar, eliminar)

**Resultado Esperado:**
- ✅ Modal con overlay oscuro
- ✅ Mensaje claro
- ✅ Botones OK/Cancelar según tipo
- ✅ Animación de entrada/salida
- ✅ Cierra con ESC o clic fuera (según configuración)

**Resultado Real:** _________

---

#### CP-051: Notificaciones
**Pasos:**
1. Realizar acciones exitosas/erróneas

**Resultado Esperado:**
- ✅ Notificación toast visible
- ✅ Iconos según tipo (✅ éxito, ❌ error)
- ✅ Desaparece automáticamente o con clic en X

**Resultado Real:** _________

---

### 🤖 MÓDULO 10: ASISTENTE VIRTUAL (Landbot)

#### CP-052: Landbot en Desktop
**Precondiciones:** Pantalla >768px
**Pasos:**
1. Ir a sección "Asistente Virtual"

**Resultado Esperado:**
- ✅ Chat embebido ocupa toda la sección
- ✅ Modo: Container (inline)
- ✅ No hay botón flotante

**Resultado Real:** _________

---

#### CP-053: Landbot en Mobile
**Precondiciones:** Pantalla <768px
**Pasos:**
1. Ir a sección "Asistente Virtual"

**Resultado Esperado:**
- ✅ Botón "🤖 Abrir Asistente Virtual" centrado
- ✅ Al hacer clic: abre chat en modo popup
- ✅ Icono flotante posicionado en esquina superior izquierda
- ✅ No se inicializa automáticamente

**Resultado Real:** _________

---

#### CP-054: Cleanup de Landbot
**Pasos:**
1. Navegar a "Asistente Virtual"
2. Cambiar a otra sección

**Resultado Esperado:**
- ✅ Instancia de Landbot destruida
- ✅ No queda botón flotante visible
- ✅ Al volver, se reinicializa correctamente

**Resultado Real:** _________

---

### 📱 MÓDULO 11: RESPONSIVE DESIGN

#### CP-055: Breakpoint 768px
**Pasos:**
1. Reducir ventana de >768px a <768px

**Resultado Esperado:**
- ✅ Layout cambia de sidebar lateral a navegación inferior
- ✅ Header superior aparece con botones de sesión
- ✅ Calendario de clases cambia a grid adaptable
- ✅ Tablas de admin se convierten en cards
- ✅ Fuentes y espaciados reducidos

**Resultado Real:** _________

---

#### CP-056: Calendario Responsive
**Pasos:**
1. Ver calendario en móvil

**Resultado Esperado:**
- ✅ Grid de columnas adaptables (min 150px, max 200px)
- ✅ Scroll horizontal si necesario
- ✅ Cards de clases legibles (padding reducido)

**Resultado Real:** _________

---

#### CP-057: Tablas Admin en Móvil
**Pasos:**
1. Admin dashboard en móvil

**Resultado Esperado:**
- ✅ Tabla se convierte en lista de cards
- ✅ Cada card muestra todos los datos
- ✅ Labels visibles antes de cada valor
- ✅ Botones de acción al final de cada card

**Resultado Real:** _________

---

#### CP-058: Orientación Landscape/Portrait
**Pasos:**
1. Rotar dispositivo móvil

**Resultado Esperado:**
- ✅ Layout se adapta correctamente
- ✅ No hay desbordamientos

**Resultado Real:** _________

---

### 🔒 MÓDULO 12: SEGURIDAD Y VALIDACIONES

#### CP-059: Token JWT Expirado
**Pasos:**
1. Dejar sesión abierta por tiempo prolongado (si hay expiración)
2. Intentar hacer petición

**Resultado Esperado:**
- ❌ Error 401: Token expirado
- ✅ Redirige a login automáticamente

**Resultado Real:** _________

---

#### CP-060: Inyección SQL/NoSQL
**Pasos:**
1. Intentar inyectar código en campos de formulario

**Resultado Esperado:**
- ✅ Inputs sanitizados
- ❌ No ejecuta código malicioso

**Resultado Real:** _________

---

#### CP-061: XSS (Cross-Site Scripting)
**Pasos:**
1. Intentar insertar `<script>alert('XSS')</script>` en campos

**Resultado Esperado:**
- ✅ Código escapado
- ❌ No ejecuta scripts

**Resultado Real:** _________

---

#### CP-062: CORS
**Pasos:**
1. Intentar hacer petición desde dominio no autorizado

**Resultado Esperado:**
- ❌ Error CORS
- ✅ Solo dominios configurados pueden acceder

**Resultado Real:** _________

---

#### CP-063: Validación de Archivos
**Pasos:**
1. Intentar subir archivos de gran tamaño o tipos no permitidos

**Resultado Esperado:**
- ❌ Rechaza archivos muy grandes (verificar límite en multer)
- ❌ Solo acepta tipos especificados (imágenes para ejercicios, PDFs para guías)

**Resultado Real:** _________

---

### ⚡ MÓDULO 13: RENDIMIENTO Y ERRORES

#### CP-064: Carga Inicial
**Pasos:**
1. Limpiar caché
2. Cargar aplicación

**Resultado Esperado:**
- ✅ Landing carga en <2 segundos
- ✅ Dashboard carga en <3 segundos
- ✅ Sin errores en consola

**Resultado Real:** _________

---

#### CP-065: Peticiones Simultáneas
**Pasos:**
1. Hacer múltiples peticiones rápidas (ej: inscribirse en varias clases rápidamente)

**Resultado Esperado:**
- ✅ Todas las peticiones procesadas correctamente
- ✅ No hay race conditions

**Resultado Real:** _________

---

#### CP-066: Error 404 en Ruta Inexistente
**Pasos:**
1. Navegar a `/ruta-que-no-existe`

**Resultado Esperado:**
- ❌ Error 404
- ✅ Mensaje amigable o redirige a landing

**Resultado Real:** _________

---

#### CP-067: Error 500 del Servidor
**Pasos:**
1. Provocar error en servidor (ej: desconectar BD temporalmente)

**Resultado Esperado:**
- ❌ Error 500
- ✅ Mensaje de error visible al usuario
- ✅ No rompe la aplicación

**Resultado Real:** _________

---

#### CP-068: Manejo de Red Lenta/Caída
**Pasos:**
1. Simular red lenta o caída de conexión

**Resultado Esperado:**
- ✅ Spinners/loading indicators visibles
- ✅ Timeout después de X segundos
- ✅ Mensaje: "Error de conexión, intenta nuevamente"

**Resultado Real:** _________

---

## ✅ CHECKLIST DE PRUEBAS

### Pre-Pruebas
- [ ] Base de datos limpia o con datos de prueba conocidos
- [ ] Servidor backend ejecutándose en puerto correcto
- [ ] Frontend ejecutándose en puerto correcto
- [ ] Variables de entorno configuradas (.env)
- [ ] Navegadores de prueba listos (Chrome, Firefox, Edge)
- [ ] Herramientas de desarrollo abiertas (DevTools)

### Durante Pruebas
- [ ] Documentar cada resultado (Pasó ✅ / Falló ❌)
- [ ] Capturar screenshots de errores
- [ ] Anotar errores en consola
- [ ] Verificar estado de BD después de cada operación crítica
- [ ] Probar en múltiples navegadores si es posible

### Post-Pruebas
- [ ] Compilar lista de bugs encontrados
- [ ] Priorizar bugs (Crítico/Alto/Medio/Bajo)
- [ ] Verificar que no hayan datos corruptos en BD
- [ ] Limpiar archivos de prueba subidos (imágenes/PDFs)

---

## 🐛 REPORTE DE BUGS (Plantilla)

**ID Bug:** BUG-XXX  
**Módulo:** ___________  
**Caso de Prueba:** CP-XXX  
**Severidad:** Crítico / Alto / Medio / Bajo  
**Descripción:** ___________  
**Pasos para Reproducir:**
1. 
2. 
3. 

**Resultado Esperado:** ___________  
**Resultado Actual:** ___________  
**Evidencia:** (Screenshot/Log)  
**Solución Propuesta:** ___________

---

## 📊 RESUMEN DE RESULTADOS

| Módulo | Total Casos | Pasados ✅ | Fallidos ❌ | % Éxito |
|--------|-------------|-----------|------------|---------|
| Autenticación | 7 | | | |
| Gestión Perfil | 4 | | | |
| Clases Usuario | 7 | | | |
| Clases Admin | 5 | | | |
| Ejercicios | 8 | | | |
| Guías | 8 | | | |
| Usuarios Admin | 4 | | | |
| Estadísticas | 2 | | | |
| Interfaz | 6 | | | |
| Landbot | 3 | | | |
| Responsive | 4 | | | |
| Seguridad | 5 | | | |
| Rendimiento | 5 | | | |
| **TOTAL** | **68** | | | |

---

## 📝 NOTAS ADICIONALES

- Probar con diferentes objetivos de usuario: aumento_masa_muscular, recomposicion_corporal, perdida_grasa
- Verificar colores específicos por tipo de clase (spinning, yoga, crossfit, pilates, zumba)
- Probar límites: edad 14 y 100, objetivoClasesSemana 1 y 10
- Verificar animaciones CSS no interfieren con funcionalidad
- Comprobar accesibilidad básica (navegación por teclado, alt text en imágenes)

---

**Fecha de ejecución:** ___________  
**Ejecutado por:** ___________  
**Entorno:** Development / Staging / Production  
**Versión:** ___________

---

## FIN DEL PLAN DE PRUEBAS
