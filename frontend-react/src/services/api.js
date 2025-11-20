import { mockAPI } from './mockData'

const API_URL = '/api'

// ⚠️ MODO DEMO: Cambia esto a true para usar datos falsos sin base de datos
const DEMO_MODE = true

// Función auxiliar para manejar respuestas
const handleResponse = async (response) => {
  // Verificar si la respuesta tiene contenido
  const contentType = response.headers.get('content-type')
  
  // Si no es JSON, probablemente es un error de ruta (devuelve HTML)
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Error: La ruta no existe o el servidor no está respondiendo JSON. Respuesta: ${response.status}`)
  }
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || data.mensaje || 'Error en la petición')
  }
  
  return data
}

// Función auxiliar para obtener headers con autenticación
const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Autenticación
export const authAPI = {
  login: async (email, password) => {
    if (DEMO_MODE) return mockAPI.auth.login(email, password)
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
  },

  register: async (nombre, email, password) => {
    if (DEMO_MODE) return mockAPI.auth.register(nombre, email, password)
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    })
    return handleResponse(response)
  }
}

// Usuarios
export const userAPI = {
  getProfile: async () => {
    if (DEMO_MODE) return mockAPI.user.getProfile()
    
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  updateProfile: async (userData) => {
    if (DEMO_MODE) return mockAPI.user.updateProfile(userData)
    
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  deleteAccount: async () => {
    if (DEMO_MODE) return mockAPI.user.deleteAccount()
    
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Admin endpoints
  getAllUsers: async () => {
    if (DEMO_MODE) return mockAPI.user.getAllUsers()
    
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  createUser: async (userData) => {
    if (DEMO_MODE) return mockAPI.user.createUser(userData)
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  updateUser: async (userId, userData) => {
    if (DEMO_MODE) return mockAPI.user.updateUser(userId, userData)
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  deleteUser: async (userId) => {
    if (DEMO_MODE) return mockAPI.user.deleteUser(userId)
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  }
}

// Clases
export const clasesAPI = {
  // Obtener todas las clases (con filtros opcionales)
  getAll: async (filtros = {}) => {
    if (DEMO_MODE) return mockAPI.clases.getAll(filtros)
    
    const params = new URLSearchParams()
    if (filtros.diaSemana) params.append('diaSemana', filtros.diaSemana)
    if (filtros.activa !== undefined) params.append('activa', filtros.activa)
    
    const url = `${API_URL}/clases${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Obtener una clase por ID
  getById: async (claseId) => {
    if (DEMO_MODE) return mockAPI.clases.getById(claseId)
    
    const response = await fetch(`${API_URL}/clases/${claseId}`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Obtener las clases del usuario autenticado
  getMisClases: async () => {
    if (DEMO_MODE) return mockAPI.clases.getMisClases()
    
    const response = await fetch(`${API_URL}/clases/mias/listado`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Inscribirse en una clase
  inscribirse: async (claseId) => {
    if (DEMO_MODE) return mockAPI.clases.inscribirse(claseId)
    
    const response = await fetch(`${API_URL}/clases/${claseId}/inscribir`, {
      method: 'POST',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Desinscribirse de una clase
  desinscribirse: async (claseId) => {
    if (DEMO_MODE) return mockAPI.clases.desinscribirse(claseId)
    
    const response = await fetch(`${API_URL}/clases/${claseId}/desinscribir`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // --- ENDPOINTS DE ADMINISTRADOR ---

  // Crear una nueva clase (admin)
  create: async (claseData) => {
    if (DEMO_MODE) return mockAPI.clases.create(claseData)
    
    const response = await fetch(`${API_URL}/clases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(claseData)
    })
    return handleResponse(response)
  },

  // Actualizar una clase (admin)
  update: async (claseId, claseData) => {
    if (DEMO_MODE) return mockAPI.clases.update(claseId, claseData)
    
    const response = await fetch(`${API_URL}/clases/${claseId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(claseData)
    })
    return handleResponse(response)
  },

  // Eliminar una clase (admin)
  delete: async (claseId) => {
    if (DEMO_MODE) return mockAPI.clases.delete(claseId)
    
    const response = await fetch(`${API_URL}/clases/${claseId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Obtener alumnos de una clase (admin)
  getAlumnos: async (claseId) => {
    if (DEMO_MODE) return mockAPI.clases.getAlumnos(claseId)
    
    const response = await fetch(`${API_URL}/clases/${claseId}/alumnos`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  }
}
