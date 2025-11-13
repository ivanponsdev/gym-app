import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../services/api'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await userAPI.getAllUsers()
      setUsers(data.usuarios || [])
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
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
          <a href="#" className="admin-nav-link active">
            Gestión Usuarios
          </a>
        </nav>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </aside>
      <main className="content">
        <section id="admin-users" className="content-section">
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
                        <td>{new Date(user.fechaRegistro).toLocaleDateString()}</td>
                        <td>
                          <button className="btn-secondary-neon" style={{ marginRight: '0.5rem' }}>
                            Editar
                          </button>
                          <button className="btn-danger-neon">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
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
