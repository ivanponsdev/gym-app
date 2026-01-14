import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, clasesAPI, ejerciciosAPI, guiasAPI } from '../services/api'
import Sidebar from '../components/Sidebar'
import CustomModal from '../components/CustomModal'

// Componente para la sección de ejercicios
const EjerciciosSection = () => {
  const [ejercicios, setEjercicios] = useState([])
  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroGrupo, setFiltroGrupo] = useState('')
  const [filtroEquipamiento, setFiltroEquipamiento] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const gruposMusculares = ['pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core', 'cardio']

  useEffect(() => {
    cargarEjercicios()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [ejercicios, filtroGrupo, filtroEquipamiento, busqueda])

  const cargarEjercicios = async () => {
    try {
      setLoading(true)
      const data = await ejerciciosAPI.obtenerTodos()
      setEjercicios(data)
      setError('')
    } catch (error) {
      console.error('Error al cargar ejercicios:', error)
      setError('Error al cargar ejercicios: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    let filtrados = ejercicios
    if (filtroGrupo) filtrados = filtrados.filter(ej => ej.grupoMuscular === filtroGrupo)
    if (filtroEquipamiento) filtrados = filtrados.filter(ej => ej.equipamiento === filtroEquipamiento)
    if (busqueda) {
      filtrados = filtrados.filter(ej => 
        ej.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        ej.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      )
    }
    setEjerciciosFiltrados(filtrados)
  }

  const limpiarFiltros = () => {
    setFiltroGrupo('')
    setFiltroEquipamiento('')
    setBusqueda('')
  }

  if (loading) {
    return (
      <section className="content-section active">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando ejercicios...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="content-section active">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={cargarEjercicios} className="btn-neon">Reintentar</button>
        </div>
      </section>
    )
  }

  return (
    <section className="content-section active">
      <h2>💪 Biblioteca de Ejercicios</h2>
      <p style={{marginBottom: '1.5rem', color: 'var(--text-color-dark)'}}>
        Explora ejercicios organizados por grupo muscular y equipamiento
      </p>

      {/* Filtros */}
      <div className="filtros-ejercicios">
        <input
          type="text"
          placeholder="Buscar ejercicios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <div className="filtro-selects">
          <select value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)} className="filter-select">
            <option value="">Todos los grupos</option>
            {gruposMusculares.map(grupo => (
              <option key={grupo} value={grupo}>{grupo.charAt(0).toUpperCase() + grupo.slice(1)}</option>
            ))}
          </select>
          <select value={filtroEquipamiento} onChange={(e) => setFiltroEquipamiento(e.target.value)} className="filter-select">
            <option value="">Cualquier lugar</option>
            <option value="casa">En casa</option>
            <option value="gimnasio">Gimnasio</option>
          </select>
          {(filtroGrupo || filtroEquipamiento || busqueda) && (
            <button onClick={limpiarFiltros} className="btn-clear-filters">✕ Limpiar</button>
          )}
        </div>
      </div>

      {/* Grid de ejercicios */}
      <div className="ejercicios-grid">
        {ejerciciosFiltrados.length > 0 ? (
          ejerciciosFiltrados.map(ejercicio => (
            <div key={ejercicio._id} className="card">
              <h3>{ejercicio.nombre}</h3>
              <div className="ejercicio-tags">
                <span className="tag-grupo">{ejercicio.grupoMuscular}</span>
                <span className={`tag-equipamiento ${ejercicio.equipamiento}`}>
                  {ejercicio.equipamiento === 'casa' ? '🏠' : '🏋️'} {ejercicio.equipamiento}
                </span>
                <span className={`tag-dificultad ${ejercicio.dificultad}`}>{ejercicio.dificultad}</span>
              </div>
              <div className="ejercicio-descripcion">
                <p>{ejercicio.descripcion}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="sin-resultados">
            <h3>🔍 No se encontraron ejercicios</h3>
            <p>Intenta ajustar los filtros o la búsqueda</p>
            <button onClick={limpiarFiltros} className="btn-neon">Ver todos</button>
          </div>
        )}
      </div>
    </section>
  )
}

// Componente para la sección de guías
const GuiasSection = () => {
  const [guias, setGuias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    cargarGuias()
  }, [])

  const cargarGuias = async () => {
    try {
      setLoading(true)
      // Si es admin, obtener todas las guías, si no, solo las del usuario
      const data = isAdmin 
        ? await guiasAPI.obtenerTodas()
        : await guiasAPI.obtenerMisGuias()
      setGuias(data)
      setError('')
    } catch (error) {
      console.error('Error al cargar guías:', error)
      setError('Error al cargar guías: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const obtenerColorObjetivo = (objetivo) => {
    const colores = {
      aumento_masa_muscular: '#e74c3c',
      recomposicion_corporal: '#f39c12',
      perdida_grasa: '#2ecc71',
      todos: '#3498db'
    }
    return colores[objetivo] || '#95a5a6'
  }

  const formatearObjetivo = (objetivo) => {
    const nombres = {
      aumento_masa_muscular: 'Aumento de Masa Muscular',
      recomposicion_corporal: 'Recomposición Corporal',
      perdida_grasa: 'Pérdida de Grasa',
      todos: 'Todos los Objetivos'
    }
    return nombres[objetivo] || objetivo
  }

  const descargarGuia = (guia) => {
    // Crear un enlace para descargar el PDF
    const link = document.createElement('a')
    link.href = `/${guia.archivoUrl}`
    link.download = `${guia.titulo}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <section className="content-section active">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando guías...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="content-section active">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={cargarGuias} className="btn-neon">Reintentar</button>
        </div>
      </section>
    )
  }

  return (
    <section className="content-section active">
      <h2>📚 {isAdmin ? 'Gestión de Guías' : 'Mis Guías'}</h2>
      <p style={{marginBottom: '1.5rem', color: 'var(--text-color-dark)'}}>
        {isAdmin 
          ? 'Todas las guías del sistema'
          : user?.objetivo 
            ? `Guías personalizadas basadas en tu objetivo: ${formatearObjetivo(user.objetivo)}`
            : 'Guías generales disponibles para ti'
        }
      </p>

      {guias.length === 0 ? (
        <div className="sin-resultados">
          <h3>📖 No hay guías disponibles</h3>
          <p>{isAdmin ? 'No hay guías en el sistema' : `Actualmente no hay guías ${user?.objetivo ? 'para tu objetivo' : 'disponibles'}`}</p>
        </div>
      ) : (
        <div className="ejercicios-grid">
          {guias.map(guia => (
            <div key={guia._id} className="card guia-card">
              <div className="guia-header">
                <h3>{guia.titulo}</h3>
                <span 
                  className="objetivo-badge"
                  style={{ backgroundColor: obtenerColorObjetivo(guia.objetivo) }}
                >
                  {formatearObjetivo(guia.objetivo)}
                </span>
              </div>
              <div className="guia-descripcion">
                <p>{guia.descripcion}</p>
              </div>
              <div className="guia-footer">
                <button 
                  className="btn-neon"
                  onClick={() => descargarGuia(guia)}
                  title="Descargar guía en PDF"
                >
                  📥 Descargar PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

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
    objetivo: '',
    objetivoClasesSemana: 3

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
        objetivo: user.objetivo || 'recomposicion_corporal',
        objetivoClasesSemana: user.objetivoClasesSemana || 5
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
    // Limpiar caché para forzar recarga desde servidor
    sessionStorage.removeItem('clases')
    sessionStorage.removeItem('misClases')
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
      objetivo: user.objetivo || 'recomposicion_corporal',
       objetivoClasesSemana: user.objetivoClasesSemana || 5
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
    { id: 'mis-clases', label: 'Mis Clases' },
    { id: 'ejercicios', label: 'Ejercicios' },
    { id: 'guias', label: 'Guías' }
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
                  <p>
                    <strong>Objetivo Semanal:</strong> 
                    <span>{user?.objetivoClasesSemana || 5}</span> 
                    clases por semana
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
                  <div className="form-group">
                    <label>Objetivo de Clases por Semana</label>
                    <input
                      type="number"
                      value={profileData.objetivoClasesSemana}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        objetivoClasesSemana: parseInt(e.target.value) || 3 
                      })}
                      min="1"
                      max="14"
                      placeholder="Ej: 5"
                    />
                    <span className="form-helper">¿Cuántas clases quieres hacer por semana?</span>
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
            {misClases.length > 0 && (
              <div className="objetivo-semanal-widget">
                <div className="objetivo-progress">
                  <div className="objetivo-numeros">
                    <span className="clases-actuales">{misClases.length}</span>
                    <span className="separador">/</span>
                    <span className="clases-objetivo">{user?.objetivoClasesSemana || 5}</span>
                  </div>
                  <div className="objetivo-label">clases esta semana</div>
                </div>
                <div className="objetivo-mensaje">
                  {misClases.length >= (user?.objetivoClasesSemana || 5) ? (
                    <>
                      <span className="icono-completado">🎉</span>
                      <span>¡Semana completada! Vas genial</span>
                    </>
                  ) : misClases.length >= (user?.objetivoClasesSemana || 5) * 0.7 ? (
                    <>
                      <span className="icono-cerca">💪</span>
                      <span>¡Muy bien! Estás cerca del objetivo</span>
                    </>
                  ) : (
                    <>
                      <span className="icono-animo">🔥</span>
                      <span>¡Vamos! Te faltan {(user?.objetivoClasesSemana || 5) - misClases.length} clases</span>
                    </>
                  )}
                </div>
              </div>
            )}
            {loadingMisClases && misClases.length === 0 ? (
              <div className="spinner-container">
                <div className="spinner-large"></div>
                <p style={{ marginTop: '1rem', color: 'var(--secondary-color)' }}>Cargando tus clases...</p>
              </div>
            ) : misClases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>No estás inscrito en ninguna clase todavía.</p>
                <button 
                  className="btn-action"
                  onClick={() => setActiveSection('clases')}
                  style={{ marginTop: '1rem' }}
                >
                  Explorar Clases Disponibles
                </button>
              </div>
            ) : (
              <div className="mis-clases-semanal">
                {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map(dia => {
                  const clasesDia = misClases
                    .filter(c => c.diaSemana === dia)
                    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                  
                  // Determinar día actual
                  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
                  const hoy = new Date().getDay()
                  const diaActual = diasSemana[hoy]
                  const esHoy = dia === diaActual
                  
                  return (
                    <div key={dia} className={`mis-clases-dia-column ${esHoy ? 'dia-hoy' : ''} ${clasesDia.length === 0 ? 'sin-clases' : ''}`}>
                      <h3 className="mis-clases-dia-header">
                        <span className="dia-nombre">{dia.charAt(0).toUpperCase() + dia.slice(1)}</span>
                        {esHoy && <span className="badge-hoy">Hoy</span>}
                        {clasesDia.length > 0 && <span className="badge-contador">{clasesDia.length}</span>}
                      </h3>
                      <div className="mis-clases-dia-contenido">
                        {clasesDia.length === 0 ? (
                          <div className="sin-clases-mensaje">
                            <span className="icono-fueguito">🔥</span>
                            <span>Aquí hay un hueco para seguir mejorando</span>
                          </div>
                        ) : (
                          clasesDia.map((clase) => (
                            <div 
                              key={clase._id} 
                              className={`mi-clase-compacta tipo-${clase.nombre.toLowerCase().replace(/\s/g, '-')}`}
                            >
                              <div className="clase-hora-badge">
                                {clase.horaInicio}
                              </div>
                              <div className="clase-info-compacta">
                                <h4 className="clase-nombre-mini">{clase.nombre}</h4>
                                <p className="clase-profesor-mini">👤 {clase.profesor}</p>
                                <p className="clase-duracion">
                                  ⏱ {clase.horaInicio} - {clase.horaFin}
                                </p>
                              </div>
                              <button 
                                className="btn-desinscribir-mini" 
                                onClick={() => handleDesinscribirse(clase._id)}
                                title="Desinscribirme"
                              >
                                ✕
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

        {activeSection === 'ejercicios' && (
          <EjerciciosSection />
        )}

        {activeSection === 'guias' && (
          <GuiasSection />
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
