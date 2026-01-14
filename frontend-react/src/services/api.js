const API_URL = '/api'

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
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
  },

  register: async (nombre, email, password) => {
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
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Admin endpoints
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  createUser: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  deleteUser: async (userId) => {
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
    const response = await fetch(`${API_URL}/clases/${claseId}`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Obtener las clases del usuario autenticado
  getMisClases: async () => {
    const response = await fetch(`${API_URL}/clases/mias/listado`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Inscribirse en una clase
  inscribirse: async (claseId) => {
    const response = await fetch(`${API_URL}/clases/${claseId}/inscribir`, {
      method: 'POST',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Desinscribirse de una clase
  desinscribirse: async (claseId) => {
    const response = await fetch(`${API_URL}/clases/${claseId}/desinscribir`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  //  ADMINISTRADOR 

  // Crear una nueva clase (admin)
  create: async (claseData) => {
    const response = await fetch(`${API_URL}/clases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(claseData)
    })
    return handleResponse(response)
  },

  // Actualizar una clase (admin)
  update: async (claseId, claseData) => {
    const response = await fetch(`${API_URL}/clases/${claseId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(claseData)
    })
    return handleResponse(response)
  },

  // Eliminar una clase (admin)
  delete: async (claseId) => {
    const response = await fetch(`${API_URL}/clases/${claseId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Obtener alumnos de una clase (admin)
  getAlumnos: async (claseId) => {
    const response = await fetch(`${API_URL}/clases/${claseId}/alumnos`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  }

}

//Ejercicios
export const ejerciciosAPI = {
  // Obtener todos los ejercicios
  obtenerTodos: async () => {
    const response = await fetch(`${API_URL}/ejercicios`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  //Filtrar por grupo muscular
  obtenerPorGrupo: async (grupoMuscular) => {
    const response = await fetch(`${API_URL}/ejercicios/grupo/${grupoMuscular}`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },
  
  //Filtrar por equipamiento
  obtenerPorEquipamiento: async (equipamiento) => {
    const response = await fetch(`${API_URL}/ejercicios/equipamiento/${equipamiento}`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  //Obtener por ID
  obtenerPorId: async (id) => {
    const response = await fetch(`${API_URL}/ejercicios/${id}`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  //Crear ejercicio (Admin)
  crear: async (ejercicioData) => {
    const formData = new FormData()
    
    //Form data archivo y campos
    Object.keys(ejercicioData).forEach(key => {
      if (key === 'imagenTecnica' && ejercicioData[key] instanceof File) {
        formData.append('imagenTecnica', ejercicioData[key])
      } else if (key !== 'imagenTecnica') {
        formData.append(key, ejercicioData[key])
      }
    })
    
    // IMPORTANTE: No incluir Content-Type en headers.
    // Fetch añade automáticamente 'multipart/form-data; boundary=...' 
    // El boundary es necesario para separar correctamente los campos del formulario con archivos
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/ejercicios`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  //Actualizar ejercicio (Admin)
  actualizar: async (id, ejercicioData) => {
    const formData = new FormData()
    //Form data archivo y campos
    Object.keys(ejercicioData).forEach(key => {
      if (key === 'imagenTecnica' && ejercicioData[key] instanceof File) {
        formData.append('imagenTecnica', ejercicioData[key])
      } else if (key !== 'imagenTecnica') {
        formData.append(key, ejercicioData[key])
      }
    })
    
    // IMPORTANTE: No incluir Content-Type en headers.
    // Boundary necesario para separar campos del formulario con archivos
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/ejercicios/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  //Eliminar ejercicio (Admin)
  eliminar: async (id) => {
    const response = await fetch(`${API_URL}/ejercicios/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  }
}

// Guías
export const guiasAPI = {
  // Obtener guías del usuario (filtradas)
  obtenerMisGuias: async () => {
    const response = await fetch(`${API_URL}/guias/mis-guias`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Obtener guía por ID
  obtenerPorId: async (id) => {
    const response = await fetch(`${API_URL}/guias/${id}`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // ADMIN Obtener todas las guías
  obtenerTodas: async () => {
    const response = await fetch(`${API_URL}/guias`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // ADMIN Crear nueva guía
  crear: async (guiaData) => {
    const formData = new FormData()
    
    Object.keys(guiaData).forEach(key => {
      if (key === 'archivoPdf' && guiaData[key] instanceof File) {
        formData.append('archivoPdf', guiaData[key])
      } else if (key !== 'archivoPdf') {
        formData.append(key, guiaData[key])
      }
    })
    
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/guias`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // ADMIN Actualizar guía
  actualizar: async (id, guiaData) => {
    const formData = new FormData()
    
    Object.keys(guiaData).forEach(key => {
      if (key === 'archivoPdf' && guiaData[key] instanceof File) {
        formData.append('archivoPdf', guiaData[key])
      } else if (key !== 'archivoPdf') {
        formData.append(key, guiaData[key])
      }
    })
    
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/guias/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // ADMIN Eliminar guía
  eliminar: async (id) => {
    const response = await fetch(`${API_URL}/guias/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return handleResponse(response)
  }
}
