import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, clasesAPI } from '../services/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    nombre: '',
    edad: '',
    objetivo: ''
  })
  const [clases, setClases] = useState([])
  const [misClases, setMisClases] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        edad: user.edad || '',
        objetivo: user.objetivo || ''
      })
    }
  }, [user])

  useEffect(() => {
    if (activeSection === 'clases') {
      loadClases()
    } else if (activeSection === 'mis-clases') {
      loadMisClases()
    }
  }, [activeSection])

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

  const loadMisClases = async () => {
    setLoading(true)
    try {
      const data = await clasesAPI.getMisClases()
      setMisClases(data.clases || [])
    } catch (error) {
      console.error('Error al cargar mis clases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = () => {
    setIsEditingProfile(true)
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setProfileData({
      nombre: user.nombre || '',
      edad: user.edad || '',
      objetivo: user.objetivo || ''
    })
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const response = await userAPI.updateProfile(profileData)
      updateUser(response.usuario)
      setIsEditingProfile(false)
      alert('Perfil actualizado correctamente')
    } catch (error) {
      alert('Error al actualizar perfil: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInscribirse = async (claseId) => {
    try {
      await clasesAPI.inscribirse(claseId)
      alert('Te has inscrito correctamente')
      loadClases()
      loadMisClases()
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleDesinscribirse = async (claseId) => {
    if (!confirm('¿Seguro que quieres desinscribirte de esta clase?')) return
    try {
      await clasesAPI.desinscribirse(claseId)
      alert('Te has desinscrito correctamente')
      loadMisClases()
      loadClases()
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div id="app-container">
      <aside className="sidebar">
        <h1 className="logo-sidebar">ULTIMATE GYM</h1>
        <nav>
          <a
            href="#"
            className={`nav-link ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveSection('profile')
            }}
          >
            Mi Perfil
          </a>
          <a
            href="#"
            className={`nav-link ${activeSection === 'clases' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveSection('clases')
            }}
          >
            Clases Disponibles
          </a>
          <a
            href="#"
            className={`nav-link ${activeSection === 'mis-clases' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveSection('mis-clases')
            }}
          >
            Mis Clases
          </a>
        </nav>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </aside>
      <main className="content">
        {activeSection === 'profile' && (
          <section id="profile" className="content-section active">
            <h2>Tu Perfil</h2>
            <div className="card">
              {!isEditingProfile ? (
                <div id="profile-display">
                  <h3>Información Personal</h3>
                  <p>
                    <strong>Nombre:</strong> <span>{user?.nombre || 'Usuario'}</span>
                  </p>
                  <p>
                    <strong>Email:</strong> <span>{user?.email || 'email@example.com'}</span>
                  </p>
                  <p>
                    <strong>Edad:</strong> <span>{user?.edad || '-'}</span> años
                  </p>
                  <p>
                    <strong>Objetivo:</strong> <span>{user?.objetivo || '-'}</span>
                  </p>
                  <button 
                    className="btn-secondary-neon" 
                    style={{ marginTop: '1rem', width: 'auto', padding: '0.8rem 1.2rem' }}
                    onClick={handleEditProfile}
                  >
                    Editar Perfil
                  </button>
                </div>
              ) : (
                <div id="profile-edit">
                  <h3>Editar Perfil</h3>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={profileData.nombre}
                      onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Edad</label>
                    <input
                      type="number"
                      value={profileData.edad}
                      onChange={(e) => setProfileData({ ...profileData, edad: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Objetivo</label>
                    <input
                      type="text"
                      value={profileData.objetivo}
                      onChange={(e) => setProfileData({ ...profileData, objetivo: e.target.value })}
                      placeholder="Ej: Perder peso, Ganar masa muscular..."
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      className="btn-neon" 
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button 
                      className="btn-secondary-neon" 
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'clases' && (
          <section id="clases" className="content-section active">
            <h2>Clases Disponibles</h2>
            {loading ? (
              <p>Cargando clases...</p>
            ) : (
              <div className="clases-grid">
                {clases.map((clase) => (
                  <div key={clase._id} className="card">
                    <h3>{clase.nombre}</h3>
                    <p><strong>Profesor:</strong> {clase.profesor}</p>
                    <p><strong>Día:</strong> {clase.diaSemana}</p>
                    <p><strong>Horario:</strong> {clase.horaInicio} - {clase.horaFin}</p>
                    <p><strong>Plazas disponibles:</strong> {clase.plazasDisponibles || clase.cupoMaximo}</p>
                    {clase.descripcion && <p>{clase.descripcion}</p>}
                    <button 
                      className="btn-neon" 
                      style={{ marginTop: '1rem' }}
                      onClick={() => handleInscribirse(clase._id)}
                    >
                      Inscribirme
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === 'mis-clases' && (
          <section id="mis-clases" className="content-section active">
            <h2>Mis Clases</h2>
            {loading ? (
              <p>Cargando tus clases...</p>
            ) : misClases.length === 0 ? (
              <p>No estás inscrito en ninguna clase todavía.</p>
            ) : (
              <div className="clases-grid">
                {misClases.map((clase) => (
                  <div key={clase._id} className="card">
                    <h3>{clase.nombre}</h3>
                    <p><strong>Profesor:</strong> {clase.profesor}</p>
                    <p><strong>Día:</strong> {clase.diaSemana}</p>
                    <p><strong>Horario:</strong> {clase.horaInicio} - {clase.horaFin}</p>
                    {clase.descripcion && <p>{clase.descripcion}</p>}
                    <button 
                      className="btn-danger-neon" 
                      style={{ marginTop: '1rem' }}
                      onClick={() => handleDesinscribirse(clase._id)}
                    >
                      Desinscribirme
                    </button>
                  </div>
                ))}
              </div>
            )}
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

export default Dashboard
