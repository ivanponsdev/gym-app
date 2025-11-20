import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, clasesAPI } from '../services/api'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activeSection, setActiveSection] = useState('users')
  const [users, setUsers] = useState([])
  const [clases, setClases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AdminDashboard - activeSection:', activeSection)
    if (activeSection === 'users') {
      loadUsers()
    } else if (activeSection === 'clases') {
      loadClases()
    }
  }, [activeSection])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await userAPI.getAllUsers()
      setUsers(data.usuarios || [])
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
      setClases(data.clases || [])
    } catch (error) {
      console.error('Error al cargar clases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return
    try {
      await userAPI.deleteUser(userId)
      alert('Usuario eliminado correctamente')
      loadUsers()
    } catch (error) {
      alert('Error al eliminar usuario: ' + error.message)
    }
  }

  const handleDeleteClase = async (claseId) => {
    if (!confirm('¿Estás seguro de eliminar esta clase?')) return
    try {
      await clasesAPI.delete(claseId)
      alert('Clase eliminada correctamente')
      loadClases()
    } catch (error) {
      alert('Error al eliminar clase: ' + error.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div id="admin-container">
      <aside className="sidebar">
        <h1 className="logo-sidebar">ULTIMATE GYM</h1>
        <nav>
          <a 
            href="#" 
            className={`admin-nav-link ${activeSection === 'users' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveSection('users')
            }}
          >
            Gestión Usuarios
          </a>
          <a 
            href="#" 
            className={`admin-nav-link ${activeSection === 'clases' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveSection('clases')
            }}
          >
            Gestión Clases
          </a>
        </nav>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </aside>
      <main className="content">
        {activeSection === 'users' && (
          <section id="admin-users" className="content-section active">
            <h2>Gestión de Usuarios</h2>
            <div className="search-container">
              <input type="search" placeholder="Buscar por nombre o email..." />
            </div>
            <div id="users-list-container">
              <button className="btn-neon" style={{ marginBottom: '20px', width: 'auto', padding: '0.8rem 1.5rem' }}>
                Añadir Usuario
              </button>
              <div className="table-wrapper">
                {loading ? (
                  <p>Cargando usuarios...</p>
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
                            <button className="btn-secondary-neon" style={{ marginRight: '0.5rem' }}>
                              Editar
                            </button>
                            <button 
                              className="btn-danger-neon"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Eliminar
                            </button>
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
              <button className="btn-neon" style={{ marginBottom: '20px', width: 'auto', padding: '0.8rem 1.5rem' }}>
                Añadir Clase
              </button>
              <div className="table-wrapper">
                {loading ? (
                  <p>Cargando clases...</p>
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
                            <button className="btn-secondary-neon" style={{ marginRight: '0.5rem' }}>
                              Editar
                            </button>
                            <button 
                              className="btn-danger-neon"
                              onClick={() => handleDeleteClase(clase._id)}
                            >
                              Eliminar
                            </button>
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

      <button 
        className="btn-exit"
        onClick={() => navigate('/')}
      >
        Salir
      </button>
    </div>
  )
}

export default AdminDashboard
