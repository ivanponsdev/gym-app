import { useState, useEffect } from 'react'
import { userAPI, clasesAPI } from '../services/api'
import Sidebar from '../components/Sidebar'
import CustomModal from '../components/CustomModal'

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('users')
  
  // Inicializar desde sessionStorage si existe
  const [users, setUsers] = useState(() => {
    const cached = sessionStorage.getItem('adminUsers')
    return cached ? JSON.parse(cached) : []
  })
  const [clases, setClases] = useState(() => {
    const cached = sessionStorage.getItem('adminClases')
    return cached ? JSON.parse(cached) : []
  })
  
  const [loading, setLoading] = useState(false)
  
  // Estados para modales personalizados
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'alert',
    message: '',
    onConfirm: null
  })
  
  // Estados usuarios
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({
    nombre: '',
    email: '',
    password: '',
    edad: '',
    objetivo: '',
    rol: 'usuario'
  })
  
  // Estados clases
  const [showClaseModal, setShowClaseModal] = useState(false)
  const [editingClase, setEditingClase] = useState(null)
  const [claseForm, setClaseForm] = useState({
    nombre: '',
    descripcion: '',
    diaSemana: 'lunes',
    horaInicio: '',
    horaFin: '',
    profesor: '',
    cupoMaximo: 20,
    activa: true
  })

  useEffect(() => {
    // Carga bajo demanda con caché: solo carga si no hay datos
    if (activeSection === 'users' && users.length === 0) {
      loadUsers()
    } else if (activeSection === 'clases' && clases.length === 0) {
      loadClases()
    }
  }, [activeSection])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await userAPI.getAllUsers()
      const usersData = data.usuarios || []
      setUsers(usersData)
      sessionStorage.setItem('adminUsers', JSON.stringify(usersData))
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadClases = async () => {
    setLoading(true)
    try {
      const data = await clasesAPI.getAll()
      const clasesData = data.clases || []
      setClases(clasesData)
      sessionStorage.setItem('adminClases', JSON.stringify(clasesData))
    } catch (error) {
      console.error('Error al cargar clases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      message: '¿Estás seguro de eliminar este usuario?',
      onConfirm: async () => {
        try {
          await userAPI.deleteUser(userId)
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Usuario eliminado correctamente',
            onConfirm: null
          })
          loadUsers()
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Error al eliminar usuario: ' + error.message,
            onConfirm: null
          })
        }
      }
    })
  }

  const handleDeleteClase = async (claseId) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      message: '¿Estás seguro de eliminar esta clase?',
      onConfirm: async () => {
        try {
          await clasesAPI.delete(claseId)
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Clase eliminada correctamente',
            onConfirm: null
          })
          loadClases()
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Error al eliminar clase: ' + error.message,
            onConfirm: null
          })
        }
      }
    })
  }

  // Funciones para usuarios
  const handleAddUser = () => {
    setEditingUser(null)
    setUserForm({
      nombre: '',
      email: '',
      password: '',
      edad: '',
      objetivo: '',
      rol: 'usuario'
    })
    setShowUserModal(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setUserForm({
      nombre: user.nombre,
      email: user.email,
      password: '',
      edad: user.edad || '',
      objetivo: user.objetivo || '',
      rol: user.rol
    })
    setShowUserModal(true)
  }

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Editar usuario existente
        const updateData = { ...userForm }
        if (!updateData.password) delete updateData.password // No actualizar password si está vacío
        await userAPI.updateUser(editingUser._id, updateData)
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'Usuario actualizado correctamente',
          onConfirm: null
        })
      } else {
        // Crear nuevo usuario
        if (!userForm.password) {
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'La contraseña es obligatoria para nuevos usuarios',
            onConfirm: null
          })
          return
        }
        await userAPI.createUser(userForm)
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'Usuario creado correctamente',
          onConfirm: null
        })
      }
      setShowUserModal(false)
      loadUsers()
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Error: ' + error.message,
        onConfirm: null
      })
    }
  }

  // Funciones para clases
  const handleAddClase = () => {
    setEditingClase(null)
    setClaseForm({
      nombre: '',
      descripcion: '',
      diaSemana: 'lunes',
      horaInicio: '',
      horaFin: '',
      profesor: '',
      cupoMaximo: 20,
      activa: true
    })
    setShowClaseModal(true)
  }

  const handleEditClase = (clase) => {
    setEditingClase(clase)
    setClaseForm({
      nombre: clase.nombre,
      descripcion: clase.descripcion || '',
      diaSemana: clase.diaSemana,
      horaInicio: clase.horaInicio,
      horaFin: clase.horaFin,
      profesor: clase.profesor,
      cupoMaximo: clase.cupoMaximo,
      activa: clase.activa
    })
    setShowClaseModal(true)
  }

  const handleSaveClase = async () => {
    try {
      if (editingClase) {
        // Editar clase existente
        await clasesAPI.update(editingClase._id, claseForm)
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'Clase actualizada correctamente',
          onConfirm: null
        })
      } else {
        // Crear nueva clase
        await clasesAPI.create(claseForm)
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'Clase creada correctamente',
          onConfirm: null
        })
      }
      setShowClaseModal(false)
      loadClases()
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Error: ' + error.message,
        onConfirm: null
      })
    }
  }

  const menuItems = [
    { id: 'users', label: 'Gestión Usuarios' },
    { id: 'clases', label: 'Gestión Clases' }
  ]

  return (
    <div id="admin-container">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />
      <main className="content">
        {activeSection === 'users' && (
          <section id="admin-users" className="content-section active">
            <h2>Gestión de Usuarios</h2>
            <div className="search-container">
              <input type="search" placeholder="Buscar por nombre o email..." />
            </div>
            <div id="users-list-container">
              <button 
                className="btn-neon btn-add" 
                style={{ marginBottom: '20px', width: 'auto', padding: '0.8rem 1.5rem' }}
                onClick={handleAddUser}
              >
                Añadir Usuario
              </button>
              <div className="table-wrapper">
                {loading && users.length === 0 ? (
                  <div className="spinner-container">
                    <div className="spinner-large"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--secondary-color)' }}>Cargando usuarios...</p>
                  </div>
                ) : users.length === 0 ? (
                  <p>No hay usuarios registrados</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Fecha de Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user._id.substring(0, 8)}...</td>
                          <td>{user.nombre}</td>
                          <td>{user.email}</td>
                          <td>{user.rol}</td>
                          <td>{new Date(user.createdAt || user.fechaRegistro).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-icon btn-edit" 
                                onClick={() => handleEditUser(user)}
                                title="Editar usuario"
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-icon btn-delete"
                                onClick={() => handleDeleteUser(user._id)}
                                title="Eliminar usuario"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'clases' && (
          <section id="admin-clases" className="content-section active">
            <h2>Gestión de Clases</h2>
            <div id="clases-list-container">
              <button 
                className="btn-neon btn-add" 
                style={{ marginBottom: '20px', width: 'auto', padding: '0.8rem 1.5rem' }}
                onClick={handleAddClase}
              >
                Añadir Clase
              </button>
              <div className="table-wrapper">
                {loading && clases.length === 0 ? (
                  <div className="spinner-container">
                    <div className="spinner-large"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--secondary-color)' }}>Cargando clases...</p>
                  </div>
                ) : clases.length === 0 ? (
                  <p>No hay clases creadas</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Profesor</th>
                        <th>Día</th>
                        <th>Horario</th>
                        <th>Cupo</th>
                        <th>Inscritos</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clases.map((clase) => (
                        <tr key={clase._id}>
                          <td>{clase.nombre}</td>
                          <td>{clase.profesor}</td>
                          <td>{clase.diaSemana}</td>
                          <td>{clase.horaInicio} - {clase.horaFin}</td>
                          <td>{clase.cupoMaximo}</td>
                          <td>{clase.numeroInscritos || clase.alumnosApuntados?.length || 0}</td>
                          <td>{clase.activa ? '✅ Activa' : '❌ Inactiva'}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-icon btn-edit" 
                                onClick={() => handleEditClase(clase)}
                                title="Editar clase"
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-icon btn-delete"
                                onClick={() => handleDeleteClase(clase._id)}
                                title="Eliminar clase"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modal para añadir/editar usuario */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? 'Editar Usuario' : 'Añadir Usuario'}</h2>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={userForm.nombre}
                onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña {editingUser ? '(dejar vacío para no cambiar)' : '*'}</label>
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder={editingUser ? 'Dejar vacío para mantener la actual' : ''}
              />
            </div>
            <div className="form-group">
              <label>Edad</label>
              <input
                type="number"
                value={userForm.edad}
                onChange={(e) => setUserForm({ ...userForm, edad: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Objetivo</label>
              <input
                type="text"
                value={userForm.objetivo}
                onChange={(e) => setUserForm({ ...userForm, objetivo: e.target.value })}
                placeholder="Ej: Perder peso, Ganar masa muscular..."
              />
            </div>
            <div className="form-group">
              <label>Rol *</label>
              <select
                value={userForm.rol}
                onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button className="btn-action" onClick={handleSaveUser}>
                {editingUser ? 'Actualizar' : 'Crear'}
              </button>
              <button className="btn-action" onClick={() => setShowUserModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para añadir/editar clase */}
      {showClaseModal && (
        <div className="modal-overlay" onClick={() => setShowClaseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingClase ? 'Editar Clase' : 'Añadir Clase'}</h2>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={claseForm.nombre}
                onChange={(e) => setClaseForm({ ...claseForm, nombre: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={claseForm.descripcion}
                onChange={(e) => setClaseForm({ ...claseForm, descripcion: e.target.value })}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Día de la semana *</label>
              <select
                value={claseForm.diaSemana}
                onChange={(e) => setClaseForm({ ...claseForm, diaSemana: e.target.value })}
              >
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miércoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sábado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hora de inicio *</label>
              <input
                type="time"
                value={claseForm.horaInicio}
                onChange={(e) => setClaseForm({ ...claseForm, horaInicio: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora de fin *</label>
              <input
                type="time"
                value={claseForm.horaFin}
                onChange={(e) => setClaseForm({ ...claseForm, horaFin: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Profesor *</label>
              <input
                type="text"
                value={claseForm.profesor}
                onChange={(e) => setClaseForm({ ...claseForm, profesor: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Cupo máximo *</label>
              <input
                type="number"
                value={claseForm.cupoMaximo}
                onChange={(e) => setClaseForm({ ...claseForm, cupoMaximo: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={claseForm.activa}
                  onChange={(e) => setClaseForm({ ...claseForm, activa: e.target.checked })}
                />
                {' '}Clase activa
              </label>
            </div>
            <div className="modal-buttons">
              <button className="btn-action" onClick={handleSaveClase}>
                {editingClase ? 'Actualizar' : 'Crear'}
              </button>
              <button className="btn-action" onClick={() => setShowClaseModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomModal
        type={modalConfig.type}
        message={modalConfig.message}
        isOpen={modalConfig.isOpen}
        onConfirm={modalConfig.onConfirm || (() => setModalConfig({ ...modalConfig, isOpen: false }))}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  )
}

export default AdminDashboard
