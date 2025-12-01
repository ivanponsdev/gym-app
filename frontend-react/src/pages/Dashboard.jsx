import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, clasesAPI } from '../services/api'
import Sidebar from '../components/Sidebar'
import CustomModal from '../components/CustomModal'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    nombre: '',
    edad: '',
    objetivo: ''
  })
  
  // Inicializar desde sessionStorage si existe
  const [clases, setClases] = useState(() => {
    const cached = sessionStorage.getItem('clases')
    return cached ? JSON.parse(cached) : []
  })
  const [misClases, setMisClases] = useState(() => {
    const cached = sessionStorage.getItem('misClases')
    return cached ? JSON.parse(cached) : []
  })
  
  const [loadingClases, setLoadingClases] = useState(false)
  const [loadingMisClases, setLoadingMisClases] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  
  // Estados para modales personalizados
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'alert',
    message: '',
    onConfirm: null
  })

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
    // Carga bajo demanda: solo carga si no hay datos en caché
    if (activeSection === 'clases' && clases.length === 0) {
      loadClases()
    } else if (activeSection === 'mis-clases' && misClases.length === 0) {
      loadMisClases()
    }
  }, [activeSection])

  const loadClases = async () => {
    setLoadingClases(true)
    try {
      const data = await clasesAPI.getAll()
      const clasesData = data.clases || []
      setClases(clasesData)
      sessionStorage.setItem('clases', JSON.stringify(clasesData))
    } catch (error) {
      console.error('Error al cargar clases:', error)
    } finally {
      setLoadingClases(false)
    }
  }

  const loadMisClases = async () => {
    setLoadingMisClases(true)
    try {
      const data = await clasesAPI.getMisClases()
      const misClasesData = data.clases || []
      setMisClases(misClasesData)
      sessionStorage.setItem('misClases', JSON.stringify(misClasesData))
    } catch (error) {
      console.error('Error al cargar mis clases:', error)
    } finally {
      setLoadingMisClases(false)
    }
  }

  // Función para refrescar datos manualmente (después de inscribirse/desinscribirse)
  const refreshClases = () => {
    loadClases()
    loadMisClases()
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
    setLoadingProfile(true)
    try {
      const response = await userAPI.updateProfile(profileData)
      updateUser(response.usuario)
      setIsEditingProfile(false)
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Perfil actualizado correctamente',
        onConfirm: null
      })
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Error al actualizar perfil: ' + error.message,
        onConfirm: null
      })
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleInscribirse = async (claseId) => {
    try {
      await clasesAPI.inscribirse(claseId)
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Te has inscrito correctamente',
        onConfirm: null
      })
      refreshClases() // Refrescar ambas listas
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: error.message,
        onConfirm: null
      })
    }
  }

  const handleDesinscribirse = async (claseId) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      message: '¿Seguro que quieres desinscribirte de esta clase?',
      onConfirm: async () => {
        try {
          await clasesAPI.desinscribirse(claseId)
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Te has desinscrito correctamente',
            onConfirm: null
          })
          refreshClases() // Refrescar ambas listas
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Error: ' + error.message,
            onConfirm: null
          })
        }
      }
    })
  }

  const menuItems = [
    { id: 'profile', label: 'Mi Perfil' },
    { id: 'clases', label: 'Clases Disponibles' },
    { id: 'mis-clases', label: 'Mis Clases' }
  ]

  return (
    <div id="app-container">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      />
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
                    className="btn-action" 
                    style={{ marginTop: '1rem', width: 'auto' }}
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
                      className="btn-action" 
                      onClick={handleSaveProfile}
                      disabled={loadingProfile}
                    >
                      {loadingProfile ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button 
                      className="btn-action" 
                      onClick={handleCancelEdit}
                      disabled={loadingProfile}
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
            {loadingClases && clases.length === 0 ? (
              <div className="spinner-container">
                <div className="spinner-large"></div>
                <p style={{ marginTop: '1rem', color: 'var(--secondary-color)' }}>Cargando clases...</p>
              </div>
            ) : clases.length === 0 ? (
              <p>No hay clases disponibles.</p>
            ) : (
              <div className="horario-semanal">
                {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map(dia => {
                  const clasesDia = clases.filter(c => c.diaSemana === dia)
                  return (
                    <div key={dia} className="dia-column">
                      <h3 className="dia-header">{dia.charAt(0).toUpperCase() + dia.slice(1)}</h3>
                      <div className="clases-dia">
                        {clasesDia.length === 0 ? (
                          <p className="sin-clases">Sin clases</p>
                        ) : (
                          clasesDia.map(clase => (
                            <div key={clase._id} className={`clase-card tipo-${clase.nombre.toLowerCase().replace(/\s/g, '-')}`}>
                              <div className="clase-hora">{clase.horaInicio} - {clase.horaFin}</div>
                              <h4 className="clase-nombre">{clase.nombre}</h4>
                              <p className="clase-profesor">{clase.profesor}</p>
                              <p className="clase-plazas">{clase.plazasDisponibles || clase.cupoMaximo} plazas</p>
                              <button 
                                className="btn-inscribir"
                                onClick={() => handleInscribirse(clase._id)}
                              >
                                Inscribirme
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {activeSection === 'mis-clases' && (
          <section id="mis-clases" className="content-section active">
            <h2>Mis Clases</h2>
            {loadingMisClases && misClases.length === 0 ? (
              <div className="spinner-container">
                <div className="spinner-large"></div>
                <p style={{ marginTop: '1rem', color: 'var(--secondary-color)' }}>Cargando tus clases...</p>
              </div>
            ) : misClases.length === 0 ? (
              <p>No estás inscrito en ninguna clase todavía.</p>
            ) : (
              <div className="mis-clases-lista">
                {misClases.map((clase) => (
                  <div key={clase._id} className={`mi-clase-card tipo-${clase.nombre.toLowerCase().replace(/\s/g, '-')}`}>
                    <div className="clase-info">
                      <h3 className="clase-nombre">{clase.nombre}</h3>
                      <div className="clase-detalles">
                        <span className="detalle">{clase.diaSemana.charAt(0).toUpperCase() + clase.diaSemana.slice(1)}</span>
                        <span className="detalle">{clase.horaInicio} - {clase.horaFin}</span>
                        <span className="detalle">{clase.profesor}</span>
                      </div>
                    </div>
                    <button 
                      className="btn-desinscribir" 
                      onClick={() => handleDesinscribirse(clase._id)}
                    >
                      <span className="icon-x">✕</span> Desinscribirme
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

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

export default Dashboard
