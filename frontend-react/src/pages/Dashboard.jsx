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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [profileData, setProfileData] = useState({
    nombre: '',
    edad: '',
    sexo: '',
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
        sexo: user.sexo || 'otro',
        objetivo: user.objetivo || 'recomposicion_corporal'
      })
    }
  }, [user])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
      sexo: user.sexo || 'otro',
      objetivo: user.objetivo || 'recomposicion_corporal'
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
    { id: 'profile', label: 'Perfil' },
    { id: 'clases', label: 'Clases' },
    { id: 'mis-clases', label: 'Mis Clases' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div id="app-container">
      {/* Header móvil con botones de sesión */}
      {isMobile && (
        <div className="mobile-header">
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
          <button className="btn-exit-sidebar" onClick={() => navigate('/')}>
            Salir
          </button>
        </div>
      )}
      
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
                    <strong>Sexo:</strong> <span>
                      {user?.sexo === 'masculino' ? 'Masculino' : 
                       user?.sexo === 'femenino' ? 'Femenino' : 
                       user?.sexo === 'otro' ? 'Otro' : '-'}
                    </span>
                  </p>
                  <p>
                    <strong>Objetivo:</strong> <span>
                      {user?.objetivo === 'aumento_masa_muscular' ? 'Aumento de Masa Muscular' :
                       user?.objetivo === 'recomposicion_corporal' ? 'Recomposición Corporal' :
                       user?.objetivo === 'perdida_grasa' ? 'Pérdida de Grasa' : '-'}
                    </span>
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
                      min="14"
                      max="100"
                      placeholder="14-100 años"
                    />
                  </div>
                  <div className="form-group">
                    <label>Sexo</label>
                    <select
                      value={profileData.sexo}
                      onChange={(e) => setProfileData({ ...profileData, sexo: e.target.value })}
                    >
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Objetivo</label>
                    <select
                      value={profileData.objetivo}
                      onChange={(e) => setProfileData({ ...profileData, objetivo: e.target.value })}
                    >
                      <option value="aumento_masa_muscular">Aumento de Masa Muscular</option>
                      <option value="recomposicion_corporal">Recomposición Corporal</option>
                      <option value="perdida_grasa">Pérdida de Grasa</option>
                    </select>
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
                            clasesDia.map(clase => {
                              const plazasDisponibles = clase.plazasDisponibles ?? (clase.cupoMaximo - (clase.alumnosApuntados?.length || 0))
                              const porcentajeOcupacion = ((clase.cupoMaximo - plazasDisponibles) / clase.cupoMaximo) * 100
                              let estadoCupo = 'disponible'
                              if (porcentajeOcupacion >= 100) estadoCupo = 'completo'
                              else if (porcentajeOcupacion >= 80) estadoCupo = 'casi-lleno'
                              
                              // Verificar si el usuario ya está inscrito en esta clase
                              const estaInscrito = clase.alumnosApuntados?.includes(user?._id) || 
                                                   misClases.some(c => c._id === clase._id)
                              
                              return (
                              <div key={clase._id} className={`clase-card tipo-${clase.nombre.toLowerCase().replace(/\s/g, '-')}`}>
                                <div className="clase-hora">{clase.horaInicio} - {clase.horaFin}</div>
                                <h4 className="clase-nombre">{clase.nombre}</h4>
                                <p className="clase-profesor">{clase.profesor}</p>
                                <div className={`clase-plazas-badge ${estadoCupo}`}>
                                  {estadoCupo === 'completo' ? '🔴' : estadoCupo === 'casi-lleno' ? '🟡' : '🟢'}
                                  {' '}{plazasDisponibles}/{clase.cupoMaximo} plazas
                                </div>
                                <button 
                                  className={`btn-inscribir ${estaInscrito ? 'inscrito' : ''}`}
                                  onClick={() => handleInscribirse(clase._id)}
                                  disabled={estadoCupo === 'completo' || estaInscrito}
                                >
                                  {estaInscrito ? '✓ Inscrito' : 
                                   estadoCupo === 'completo' ? 'Clase Completa' : 'Inscribirme'}
                                </button>
                                {estaInscrito && (
                                  <div className="tooltip-inscrito">
                                    Ve a "Mis Clases" para gestionar tu inscripción
                                  </div>
                                )}
                              </div>
                            )})
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
