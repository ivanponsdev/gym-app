// Mock data para modo demo sin base de datos

// Usuarios de ejemplo
const mockUsers = [
  {
    _id: '1',
    nombre: 'Admin Demo',
    email: 'admin@demo.com',
    edad: 30,
    objetivo: 'Gestión del gimnasio',
    rol: 'admin',
    createdAt: new Date('2025-01-01').toISOString()
  },
  {
    _id: '2',
    nombre: 'Usuario Demo',
    email: 'usuario@demo.com',
    edad: 25,
    objetivo: 'Perder peso',
    rol: 'usuario',
    createdAt: new Date('2025-01-15').toISOString()
  },
  {
    _id: '3',
    nombre: 'María García',
    email: 'maria@demo.com',
    edad: 28,
    objetivo: 'Ganar masa muscular',
    rol: 'usuario',
    createdAt: new Date('2025-02-01').toISOString()
  }
]

// Clases de ejemplo
const mockClases = [
  {
    _id: 'clase1',
    nombre: 'Spinning',
    descripcion: 'Clase de ciclismo indoor de alta intensidad.',
    diaSemana: 'lunes',
    horaInicio: '07:00',
    horaFin: '08:00',
    profesor: 'Carlos Martínez',
    cupoMaximo: 25,
    activa: true,
    alumnosApuntados: ['2'],
    plazasDisponibles: 24,
    numeroInscritos: 1
  },
  {
    _id: 'clase2',
    nombre: 'Yoga Matinal',
    descripcion: 'Sesión de yoga para comenzar el día con energía.',
    diaSemana: 'lunes',
    horaInicio: '09:00',
    horaFin: '10:00',
    profesor: 'Ana García',
    cupoMaximo: 20,
    activa: true,
    alumnosApuntados: [],
    plazasDisponibles: 20,
    numeroInscritos: 0
  },
  {
    _id: 'clase3',
    nombre: 'CrossFit',
    descripcion: 'Entrenamiento funcional de alta intensidad.',
    diaSemana: 'lunes',
    horaInicio: '18:00',
    horaFin: '19:00',
    profesor: 'Miguel Torres',
    cupoMaximo: 15,
    activa: true,
    alumnosApuntados: ['2', '3'],
    plazasDisponibles: 13,
    numeroInscritos: 2
  },
  {
    _id: 'clase4',
    nombre: 'Pilates',
    descripcion: 'Método de ejercicio que fortalece el core.',
    diaSemana: 'martes',
    horaInicio: '10:00',
    horaFin: '11:00',
    profesor: 'Laura Sánchez',
    cupoMaximo: 18,
    activa: true,
    alumnosApuntados: [],
    plazasDisponibles: 18,
    numeroInscritos: 0
  },
  {
    _id: 'clase5',
    nombre: 'Zumba',
    descripcion: 'Baile fitness con ritmos latinos.',
    diaSemana: 'martes',
    horaInicio: '19:00',
    horaFin: '20:00',
    profesor: 'Carmen López',
    cupoMaximo: 30,
    activa: true,
    alumnosApuntados: ['3'],
    plazasDisponibles: 29,
    numeroInscritos: 1
  }
]

// Token fake para simular autenticación
const generateMockToken = (user) => {
  return `mock_token_${user._id}_${Date.now()}`
}

// Simulación de delay de red
const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Estado global del modo demo
let currentMockUser = null

// Inicializar currentMockUser desde localStorage si existe
const initMockUser = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      currentMockUser = JSON.parse(storedUser)
    } catch (error) {
      console.error('Error al parsear usuario desde localStorage:', error)
    }
  }
}

// Inicializar al cargar el módulo
initMockUser()

let mockUsersState = [...mockUsers]
let mockClasesState = [...mockClases]

export const mockAPI = {
  // Auth
  auth: {
    login: async (email, password) => {
      await mockDelay()
      const user = mockUsersState.find(u => u.email === email)
      if (!user || password !== 'demo123') {
        throw new Error('Credenciales inválidas. Usa: admin@demo.com / demo123 o usuario@demo.com / demo123')
      }
      currentMockUser = user
      const token = generateMockToken(user)
      return { token, usuario: user }
    },

    register: async (nombre, email, password) => {
      await mockDelay()
      if (mockUsersState.find(u => u.email === email)) {
        throw new Error('El email ya está registrado')
      }
      const newUser = {
        _id: `user_${Date.now()}`,
        nombre,
        email,
        edad: null,
        objetivo: '',
        rol: 'usuario',
        createdAt: new Date().toISOString()
      }
      mockUsersState.push(newUser)
      currentMockUser = newUser
      const token = generateMockToken(newUser)
      return { token, usuario: newUser }
    }
  },

  // Users
  user: {
    getProfile: async () => {
      await mockDelay()
      if (!currentMockUser) throw new Error('No autenticado')
      return { usuario: currentMockUser }
    },

    updateProfile: async (userData) => {
      await mockDelay()
      if (!currentMockUser) throw new Error('No autenticado')
      currentMockUser = { ...currentMockUser, ...userData }
      const index = mockUsersState.findIndex(u => u._id === currentMockUser._id)
      if (index !== -1) mockUsersState[index] = currentMockUser
      return { mensaje: 'Perfil actualizado', usuario: currentMockUser }
    },

    deleteAccount: async () => {
      await mockDelay()
      if (!currentMockUser) throw new Error('No autenticado')
      mockUsersState = mockUsersState.filter(u => u._id !== currentMockUser._id)
      currentMockUser = null
      return { mensaje: 'Cuenta eliminada' }
    },

    getAllUsers: async () => {
      await mockDelay()
      if (!currentMockUser || currentMockUser.rol !== 'admin') {
        throw new Error('Acceso denegado')
      }
      return { usuarios: mockUsersState }
    },

    createUser: async (userData) => {
      await mockDelay()
      if (!currentMockUser || currentMockUser.rol !== 'admin') {
        throw new Error('Acceso denegado')
      }
      const newUser = {
        _id: `user_${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString()
      }
      mockUsersState.push(newUser)
      return { mensaje: 'Usuario creado', usuario: newUser }
    },

    updateUser: async (userId, userData) => {
      await mockDelay()
      if (!currentMockUser || currentMockUser.rol !== 'admin') {
        throw new Error('Acceso denegado')
      }
      const index = mockUsersState.findIndex(u => u._id === userId)
      if (index === -1) throw new Error('Usuario no encontrado')
      mockUsersState[index] = { ...mockUsersState[index], ...userData }
      return { mensaje: 'Usuario actualizado', usuario: mockUsersState[index] }
    },

    deleteUser: async (userId) => {
      await mockDelay()
      if (!currentMockUser || currentMockUser.rol !== 'admin') {
        throw new Error('Acceso denegado')
      }
      mockUsersState = mockUsersState.filter(u => u._id !== userId)
      return { mensaje: 'Usuario eliminado' }
    }
  },

  // Clases
  clases: {
    getAll: async (filtros = {}) => {
      await mockDelay()
      let clases = [...mockClasesState]
      if (filtros.diaSemana) {
        clases = clases.filter(c => c.diaSemana === filtros.diaSemana)
      }
      if (filtros.activa !== undefined) {
        clases = clases.filter(c => c.activa === filtros.activa)
      }
      return { total: clases.length, clases }
    },

    getById: async (claseId) => {
      await mockDelay()
      const clase = mockClasesState.find(c => c._id === claseId)
      if (!clase) throw new Error('Clase no encontrada')
      return { clase }
    },

    getMisClases: async () => {
      await mockDelay()
      if (!currentMockUser) throw new Error('No autenticado')
      const misClases = mockClasesState.filter(c => 
        c.alumnosApuntados.includes(currentMockUser._id)
      )
      return { total: misClases.length, clases: misClases }
    },

    inscribirse: async (claseId) => {
      await mockDelay()
      if (!currentMockUser) throw new Error('No autenticado')
      const clase = mockClasesState.find(c => c._id === claseId)
      if (!clase) throw new Error('Clase no encontrada')
      if (clase.alumnosApuntados.includes(currentMockUser._id)) {
        throw new Error('Ya estás inscrito en esta clase')
      }
      if (clase.alumnosApuntados.length >= clase.cupoMaximo) {
        throw new Error('La clase está llena')
      }
      clase.alumnosApuntados.push(currentMockUser._id)
      clase.plazasDisponibles = clase.cupoMaximo - clase.alumnosApuntados.length
      clase.numeroInscritos = clase.alumnosApuntados.length
      return { 
        message: `Te has inscrito exitosamente en ${clase.nombre}`,
        clase 
      }
    },

    desinscribirse: async (claseId) => {
      await mockDelay()
      if (!currentMockUser) throw new Error('No autenticado')
      const clase = mockClasesState.find(c => c._id === claseId)
      if (!clase) throw new Error('Clase no encontrada')
      if (!clase.alumnosApuntados.includes(currentMockUser._id)) {
        throw new Error('No estás inscrito en esta clase')
      }
      clase.alumnosApuntados = clase.alumnosApuntados.filter(id => id !== currentMockUser._id)
      clase.plazasDisponibles = clase.cupoMaximo - clase.alumnosApuntados.length
      clase.numeroInscritos = clase.alumnosApuntados.length
      return { 
        message: `Te has desinscrito correctamente de ${clase.nombre}`,
        clase 
      }
    },

    create: async (claseData) => {
      await mockDelay()
      if (!currentMockUser || currentMockUser.rol !== 'admin') {
        throw new Error('Acceso denegado')
      }
      const newClase = {
        _id: `clase_${Date.now()}`,
        ...claseData,
        alumnosApuntados: [],
        plazasDisponibles: claseData.cupoMaximo || 20,
        numeroInscritos: 0,
        activa: claseData.activa !== undefined ? claseData.activa : true
      }
      mockClasesState.push(newClase)
      return { message: 'Clase creada correctamente', clase: newClase }
    },

    update: async (claseId, claseData) => {
      await mockDelay()
      if (!currentMockUser || currentMockUser.rol !== 'admin') {
        throw new Error('Acceso denegado')
      }
      const index = mockClasesState.findIndex(c => c._id === claseId)
      if (index === -1) throw new Error('Clase no encontrada')
      mockClasesState[index] = { ...mockClasesState[index], ...claseData }
      return { message: 'Clase actualizada correctamente', clase: mockClasesState[index] }
    },

    delete: async (claseId) => {
      await mockDelay()
      if (!currentMockUser || currentMockUser.rol !== 'admin') {
        throw new Error('Acceso denegado')
      }
      const clase = mockClasesState.find(c => c._id === claseId)
      if (!clase) throw new Error('Clase no encontrada')
      mockClasesState = mockClasesState.filter(c => c._id !== claseId)
      return { 
        message: 'Clase eliminada correctamente',
        claseEliminada: clase
      }
    },

    getAlumnos: async (claseId) => {
      await mockDelay()
      if (!currentMockUser || currentMockUser.rol !== 'admin') {
        throw new Error('Acceso denegado')
      }
      const clase = mockClasesState.find(c => c._id === claseId)
      if (!clase) throw new Error('Clase no encontrada')
      const alumnos = mockUsersState.filter(u => 
        clase.alumnosApuntados.includes(u._id)
      )
      return {
        clase: {
          _id: clase._id,
          nombre: clase.nombre,
          diaSemana: clase.diaSemana,
          horaInicio: clase.horaInicio,
          cupoMaximo: clase.cupoMaximo
        },
        totalAlumnos: alumnos.length,
        plazasDisponibles: clase.cupoMaximo - alumnos.length,
        alumnos
      }
    }
  },

  // Reset para volver al estado inicial
  reset: () => {
    currentMockUser = null
    mockUsersState = [...mockUsers]
    mockClasesState = [...mockClases]
  }
}
