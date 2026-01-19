import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, clasesAPI, ejerciciosAPI, guiasAPI, statsAPI } from '../services/api'
import Sidebar from '../components/Sidebar'
import CustomModal from '../components/CustomModal'
import GraficoBarras from '../components/charts/GraficoBarras'
import GraficoCircular from '../components/charts/GraficoCircular'
import GraficoLineal from '../components/charts/GraficoLineal'

// Componente para la sección de estadísticas
const EstadisticasSection = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      setLoading(true)
      const data = await statsAPI.obtenerEstadisticasGlobales()
      console.log('Datos de estadísticas recibidos:', data)
      setStats(data)
      setError('')
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
      setError('Error al cargar estadísticas: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="content-section active">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando estadísticas del negocio...</p>
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
          <button onClick={cargarEstadisticas} className="btn-neon">Reintentar</button>
        </div>
      </section>
    )
  }

  if (!stats) {
    return (
      <section className="content-section active">
        <div className="sin-resultados">
          <h3>📊 No hay estadísticas disponibles</h3>
          <p>No hay datos suficientes en el sistema</p>
        </div>
      </section>
    )
  }

  return (
    <section className="content-section active">
      <h2>📊 Estadísticas del Negocio</h2>
      <p style={{marginBottom: '1.5rem', color: 'var(--text-color-dark)'}}>
        Dashboard de métricas clave del gimnasio
      </p>

      {/* Tarjetas de KPIs */}
      <div className="stats-summary-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{textAlign: 'center', padding: '1.5rem'}}>
          <h3 style={{fontSize: '2.5rem', margin: '0', color: 'var(--neon-color)'}}>
            {stats.totalUsuarios}
          </h3>
          <p style={{margin: '0.5rem 0 0 0', color: 'var(--text-color-dark)'}}>
            👥 Total Usuarios
          </p>
        </div>
        
        <div className="card" style={{textAlign: 'center', padding: '1.5rem'}}>
          <h3 style={{fontSize: '2.5rem', margin: '0', color: 'var(--neon-color)'}}>
            {stats.totalClases}
          </h3>
          <p style={{margin: '0.5rem 0 0 0', color: 'var(--text-color-dark)'}}>
            🏋️ Total Clases
          </p>
        </div>
        
        <div className="card" style={{textAlign: 'center', padding: '1.5rem'}}>
          <h3 style={{fontSize: '2.5rem', margin: '0', color: 'var(--neon-color)'}}>
            {stats.totalInscripciones || 0}
          </h3>
          <p style={{margin: '0.5rem 0 0 0', color: 'var(--text-color-dark)'}}>
            ✅ Total Inscripciones
          </p>
        </div>

        <div className="card" style={{textAlign: 'center', padding: '1.5rem'}}>
          <h3 style={{fontSize: '2.5rem', margin: '0', color: 'var(--neon-color)'}}>
            {stats.promedioInscritosPorClase || 0}
          </h3>
          <p style={{margin: '0.5rem 0 0 0', color: 'var(--text-color-dark)'}}>
            📊 Promedio/Clase
          </p>
        </div>
      </div>

      {/* Mobile-only insights (replaces graphs on small screens) */}
      <div className="mobile-graph-insights" style={{display: 'none'}}>
        {/* Objetivos de usuarios */}
        <div className="card" style={{gridColumn: '1 / -1', background: 'rgba(148, 0, 211, 0.1)', border: '1px solid rgba(148, 0, 211, 0.3)'}}>
          <p style={{margin: 0, fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--neon-color)'}}>🎯 OBJETIVOS DE USUARIOS</p>
        </div>
        {stats.usuariosPorObjetivo && stats.usuariosPorObjetivo.map((item, index) => (
          <div key={`objetivo-${index}`} className="card">
            <h3>{item.value}</h3>
            <p>{item.name}</p>
          </div>
        ))}
        
        {/* Distribución por sexo */}
        <div className="card" style={{gridColumn: '1 / -1', background: 'rgba(148, 0, 211, 0.1)', border: '1px solid rgba(148, 0, 211, 0.3)'}}>
          <p style={{margin: 0, fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--neon-color)'}}>👥 USUARIOS POR SEXO</p>
        </div>
        {stats.usuariosPorSexo && stats.usuariosPorSexo.map((item, index) => (
          <div key={`sexo-${index}`} className="card">
            <h3>{item.cantidad}</h3>
            <p>{item.sexo}</p>
          </div>
        ))}
      </div>

      {/* Gráficos principales */}
      <div className="stats-charts-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Gráfico Circular*/}
        {stats.usuariosPorObjetivo && stats.usuariosPorObjetivo.length > 0 && (
          <div className="card" style={{padding: '1.5rem', height: '400px'}}>
            <GraficoCircular
              data={stats.usuariosPorObjetivo}
              dataKey="value"
              nameKey="name"
              titulo="Distribución de Usuarios por Objetivo"
            />
          </div>
        )}

        {/* Gráfico de Barras */}
        {stats.usuariosPorSexo && stats.usuariosPorSexo.length > 0 && (
          <div className="card" style={{padding: '1.5rem', height: '400px'}}>
            <GraficoBarras
              data={stats.usuariosPorSexo}
              dataKey="cantidad"
              xAxisKey="sexo"
              titulo="Usuarios Activos por Sexo"
              colors={['#00BFFF', '#FF1493', '#FFFF00']}
            />
          </div>
        )}

        {/* Gráfico de Líneal*/}
        {stats.evolucionPorGrupoEdad && stats.evolucionPorGrupoEdad.length > 0 && (
          <div className="card" style={{padding: '1.5rem', height: '450px'}}>
            <GraficoLineal
              data={stats.evolucionPorGrupoEdad}
              dataKeys={['18-29', '30-44', '45+']}
              xAxisKey="mes"
              titulo="Evolución de Inscritos por Grupo de Edad"
              colors={['#00BFFF', '#FFFF00', '#FF1493']}
            />
          </div>
        )}
      </div>

      {/* Tabla de clases populares */}
      {stats.clasesPopulares && stats.clasesPopulares.length > 0 && (
        <div className="card" style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
          <h3 style={{margin: '0 0 1.5rem 0', textAlign: 'center', fontSize: '1.5rem'}}>🏆 Rankings y Estadísticas Destacadas</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
            {/* Clase TOP */}
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.1) 0%, rgba(148, 0, 211, 0.1) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(0, 191, 255, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                fontSize: '4rem',
                opacity: '0.1'
              }}>🏋️</div>
              <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color-dark)', textTransform: 'uppercase', letterSpacing: '1px'}}>
                Clase TOP
              </h4>
              <p style={{margin: '0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#00BFFF'}}>
                {stats.clasesPopulares[0]?.nombre || 'N/A'}
              </p>
              <p style={{margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-color-dark)'}}>
                {stats.clasesPopulares[0]?.inscritos || 0} inscritos • {stats.clasesPopulares[0]?.dia} {stats.clasesPopulares[0]?.hora}
              </p>
            </div>

            {/* Hora de entrenamiento TOP */}
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.1) 0%, rgba(255, 255, 0, 0.1) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(255, 20, 147, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                fontSize: '4rem',
                opacity: '0.1'
              }}>⏰</div>
              <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color-dark)', textTransform: 'uppercase', letterSpacing: '1px'}}>
                Hora TOP
              </h4>
              <p style={{margin: '0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#FF1493'}}>
                {(() => {
                  // Encontrar la hora más popular contando clases por hora
                  const horasCounts = {}
                  stats.clasesPopulares.forEach(clase => {
                    const hora = clase.hora
                    horasCounts[hora] = (horasCounts[hora] || 0) + clase.inscritos
                  })
                  const horaTop = Object.entries(horasCounts).sort((a, b) => b[1] - a[1])[0]
                  return horaTop ? horaTop[0] : 'N/A'
                })()}
              </p>
              <p style={{margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-color-dark)'}}>
                Horario con más demanda
              </p>
            </div>

            {/* Asistente Paco (LandBot) */}
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.1) 0%, rgba(0, 255, 0, 0.1) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                fontSize: '4rem',
                opacity: '0.1'
              }}>🤖</div>
              <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color-dark)', textTransform: 'uppercase', letterSpacing: '1px'}}>
                Asistente Paco
              </h4>
              <p style={{margin: '0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#FFFF00'}}>
                {stats.interaccionesLandBot || '---'}
              </p>
              <p style={{margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-color-dark)'}}>
                Conversaciones iniciadas
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="card" style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <h3 style={{margin: '0 0 1.5rem 0', textAlign: 'center', fontSize: '1.5rem'}}>💡 Insights del Negocio</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(148, 0, 211, 0.1) 0%, rgba(0, 191, 255, 0.1) 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(148, 0, 211, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              fontSize: '4rem',
              opacity: '0.1'
            }}>⭐</div>
            <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color-dark)', textTransform: 'uppercase', letterSpacing: '1px'}}>
              Clase más demandada
            </h4>
            <p style={{margin: '0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#9400D3'}}>
              {stats.clasesPopulares?.[0]?.nombre || 'N/A'}
            </p>
            <p style={{margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-color-dark)'}}>
              La clase favorita del mes
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.1) 0%, rgba(255, 20, 147, 0.1) 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(0, 191, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              fontSize: '4rem',
              opacity: '0.1'
            }}>👥</div>
            <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color-dark)', textTransform: 'uppercase', letterSpacing: '1px'}}>
              Grupo de edad predominante
            </h4>
            <p style={{margin: '0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#00BFFF'}}>
              {stats.evolucionPorGrupoEdad && stats.evolucionPorGrupoEdad.length > 0
                ? (() => {
                    const ultimo = stats.evolucionPorGrupoEdad[stats.evolucionPorGrupoEdad.length - 1]
                    const max = Math.max(ultimo['18-29'], ultimo['30-44'], ultimo['45+'])
                    if (max === ultimo['18-29']) return '18-29 años'
                    if (max === ultimo['30-44']) return '30-44 años'
                    return '45+ años'
                  })()
                : 'N/A'
              }
            </p>
            <p style={{margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-color-dark)'}}>
              Segmento con más usuarios
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.1) 0%, rgba(148, 0, 211, 0.1) 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(255, 20, 147, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              fontSize: '4rem',
              opacity: '0.1'
            }}>📈</div>
            <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color-dark)', textTransform: 'uppercase', letterSpacing: '1px'}}>
              Crecimiento último mes
            </h4>
            <p style={{margin: '0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#FF1493'}}>
              {stats.evolucionPorGrupoEdad && stats.evolucionPorGrupoEdad.length > 1
                ? (() => {
                    const ultimo = stats.evolucionPorGrupoEdad[stats.evolucionPorGrupoEdad.length - 1]
                    const penultimo = stats.evolucionPorGrupoEdad[stats.evolucionPorGrupoEdad.length - 2]
                    const totalUltimo = ultimo['18-29'] + ultimo['30-44'] + ultimo['45+']
                    const totalPenultimo = penultimo['18-29'] + penultimo['30-44'] + penultimo['45+']
                    const diferencia = totalUltimo - totalPenultimo
                    return `${diferencia >= 0 ? '+' : ''}${diferencia}`
                  })()
                : 'N/A'
              }
            </p>
            <p style={{margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-color-dark)'}}>
              Usuarios vs mes anterior
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activeSection, setActiveSection] = useState('estadisticas')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  
  // Inicializar desde sessionStorage si existe
  const [users, setUsers] = useState(() => {
    const cached = sessionStorage.getItem('adminUsers')
    return cached ? JSON.parse(cached) : []
  })
  const [clases, setClases] = useState(() => {
    const cached = sessionStorage.getItem('adminClases')
    return cached ? JSON.parse(cached) : []
  })
  const [ejercicios, setEjercicios] = useState(() => {
    const cached = sessionStorage.getItem('adminEjercicios')
    return cached ? JSON.parse(cached) : []
  })
  const [guias, setGuias] = useState(() => {
    const cached = sessionStorage.getItem('adminGuias')
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
    sexo: 'otro',
    objetivo: 'recomposicion_corporal',
    role: 'user'
  })
  
  // Estados clases
  const [showClaseModal, setShowClaseModal] = useState(false)
  const [editingClase, setEditingClase] = useState(null)
  const [filtroDiaClase, setFiltroDiaClase] = useState('')
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

  // Estados ejercicios
  const [showEjercicioModal, setShowEjercicioModal] = useState(false)
  const [editingEjercicio, setEditingEjercicio] = useState(null)
  const [ejercicioForm, setEjercicioForm] = useState({
    nombre: '',
    descripcion: '',
    grupoMuscular: 'pecho',
    dificultad: 'principiante',
    equipamiento: 'casa'
  })

  // Estados guías
  const [showGuiaModal, setShowGuiaModal] = useState(false)
  const [editingGuia, setEditingGuia] = useState(null)
  const [guiaForm, setGuiaForm] = useState({
    titulo: '',
    descripcion: '',
    objetivo: 'todos',
    activa: true
  })

  useEffect(() => {
    // Carga bajo demanda con caché: solo carga si no hay datos
    if (activeSection === 'users' && users.length === 0) {
      loadUsers()
    } else if (activeSection === 'clases' && clases.length === 0) {
      loadClases()
    } else if (activeSection === 'ejercicios' && ejercicios.length === 0) {
      loadEjercicios()
    } else if (activeSection === 'guias' && guias.length === 0) {
      loadGuias()
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

  const loadEjercicios = async () => {
    setLoading(true)
    try {
      const data = await ejerciciosAPI.obtenerTodos()
      setEjercicios(data)
      sessionStorage.setItem('adminEjercicios', JSON.stringify(data))
    } catch (error) {
      console.error('Error al cargar ejercicios:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadGuias = async () => {
    setLoading(true)
    try {
      const data = await guiasAPI.obtenerTodas()
      setGuias(data)
      sessionStorage.setItem('adminGuias', JSON.stringify(data))
    } catch (error) {
      console.error('Error al cargar guías:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      message: '¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer.',
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
      message: '¿Seguro que quieres eliminar esta clase? Esta acción no se puede deshacer.',
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

  const handleDeleteEjercicio = async (ejercicioId) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      message: '¿Seguro que quieres eliminar este ejercicio? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          await ejerciciosAPI.eliminar(ejercicioId)
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Ejercicio eliminado correctamente',
            onConfirm: null
          })
          loadEjercicios()
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Error al eliminar ejercicio: ' + error.message,
            onConfirm: null
          })
        }
      }
    })
  }

  const handleDeleteGuia = async (guiaId) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      message: '¿Seguro que quieres eliminar esta guía? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          await guiasAPI.eliminar(guiaId)
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Guía eliminada correctamente',
            onConfirm: null
          })
          loadGuias()
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'Error al eliminar guía: ' + error.message,
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
      sexo: 'otro',
      objetivo: 'recomposicion_corporal',
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
      sexo: user.sexo || 'otro',
      objetivo: user.objetivo || 'recomposicion_corporal',
      role: user.role
    })
    setShowUserModal(true)
  }

  const handleSaveUser = async () => {
    try {
      // Validar nombre
      const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+\s+[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
      if (!nombreRegex.test(userForm.nombre.trim())) {
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'El nombre debe contener al menos nombre y apellido (mínimo 2 palabras)',
          onConfirm: null
        })
        return
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userForm.email)) {
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'El formato del email no es válido',
          onConfirm: null
        })
        return
      }
      
      // Validar contraseña si se proporciona (para crear o editar)
      if (userForm.password && userForm.password.trim() !== '') {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
        if (!passwordRegex.test(userForm.password)) {
          setModalConfig({
            isOpen: true,
            type: 'alert',
            message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
            onConfirm: null
          })
          return
        }
      }
      
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

  // Funciones para ejercicios
  const handleAddEjercicio = () => {
    setEditingEjercicio(null)
    setEjercicioForm({
      nombre: '',
      descripcion: '',
      grupoMuscular: 'pecho',
      dificultad: 'principiante',
      equipamiento: 'casa'
    })
    setShowEjercicioModal(true)
  }

  const handleEditEjercicio = (ejercicio) => {
    setEditingEjercicio(ejercicio)
    setEjercicioForm({
      nombre: ejercicio.nombre,
      descripcion: ejercicio.descripcion || '',
      grupoMuscular: ejercicio.grupoMuscular,
      dificultad: ejercicio.dificultad,
      equipamiento: ejercicio.equipamiento
    })
    setShowEjercicioModal(true)
  }

  const handleSaveEjercicio = async () => {
    try {
      if (editingEjercicio) {
        // Editar ejercicio existente
        await ejerciciosAPI.actualizar(editingEjercicio._id, ejercicioForm)
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'Ejercicio actualizado correctamente',
          onConfirm: null
        })
      } else {
        // Crear nuevo ejercicio
        await ejerciciosAPI.crear(ejercicioForm)
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'Ejercicio creado correctamente',
          onConfirm: null
        })
      }
      setShowEjercicioModal(false)
      loadEjercicios()
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        message: 'Error: ' + error.message,
        onConfirm: null
      })
    }
  }

  // Funciones para guías
  const handleAddGuia = () => {
    setEditingGuia(null)
    setGuiaForm({
      titulo: '',
      descripcion: '',
      objetivo: 'todos',
      activa: true
    })
    setShowGuiaModal(true)
  }

  const handleEditGuia = (guia) => {
    setEditingGuia(guia)
    setGuiaForm({
      titulo: guia.titulo,
      descripcion: guia.descripcion || '',
      objetivo: guia.objetivo,
      activa: guia.activa
    })
    setShowGuiaModal(true)
  }

  const handleSaveGuia = async () => {
    try {
      if (editingGuia) {
        await guiasAPI.actualizar(editingGuia._id, guiaForm)
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'Guía actualizada correctamente',
          onConfirm: null
        })
      } else {
        await guiasAPI.crear(guiaForm)
        setModalConfig({
          isOpen: true,
          type: 'alert',
          message: 'Guía creada correctamente',
          onConfirm: null
        })
      }
      setShowGuiaModal(false)
      loadGuias()
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
    { id: 'estadisticas', label: '📊 Estadísticas' },
    { id: 'users', label: 'Gestión Usuarios' },
    { id: 'clases', label: 'Gestión Clases' },
    { id: 'ejercicios', label: 'Gestión Ejercicios' },
    { id: 'guias', label: 'Gestión Guías' }
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div id="admin-container">
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
        {activeSection === 'estadisticas' && <EstadisticasSection />}
        
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
                  <>
                    {/* Vista móvil */}
                    <div className="mobile-admin-list">
                      {users.map((user) => (
                        <div key={user._id} className="mobile-admin-item">
                          <div className="mobile-admin-item-text">
                            {user.nombre} ({user.email})
                          </div>
                          <div className="mobile-admin-item-actions">
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
                        </div>
                      ))}
                    </div>
                    {/* Vista desktop */}
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
                          <td>{user.role}</td>
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
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'clases' && (
          <section id="admin-clases" className="content-section active">
            <h2>Gestión de Clases</h2>
            <div id="clases-list-container">
              {/* Filtro por día en móvil */}
              <div className="filtro-dia-mobile" style={{marginBottom: '1rem'}}>
                <select 
                  className="filter-select"
                  value={filtroDiaClase}
                  onChange={(e) => setFiltroDiaClase(e.target.value)}
                  style={{width: '100%', padding: '0.75rem', fontSize: '0.9rem'}}
                >
                  <option value="">Todos los días</option>
                  <option value="lunes">Lunes</option>
                  <option value="martes">Martes</option>
                  <option value="miércoles">Miércoles</option>
                  <option value="jueves">Jueves</option>
                  <option value="viernes">Viernes</option>
                  <option value="sábado">Sábado</option>
                  <option value="domingo">Domingo</option>
                </select>
              </div>
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
                  <>
                    {/* Vista móvil */}
                    <div className="mobile-admin-list">
                      {clases
                        .filter(clase => !filtroDiaClase || clase.diaSemana.toLowerCase() === filtroDiaClase.toLowerCase())
                        .map((clase) => (
                        <div key={clase._id} className="mobile-admin-item">
                          <div className="mobile-admin-item-text">
                            {clase.nombre} - {clase.horaInicio} a {clase.horaFin}
                          </div>
                          <div className="mobile-admin-item-actions">
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
                        </div>
                      ))}
                    </div>
                    {/* Vista desktop */}
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
                      {clases
                        .filter(clase => !filtroDiaClase || clase.diaSemana.toLowerCase() === filtroDiaClase.toLowerCase())
                        .map((clase) => (
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
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'ejercicios' && (
          <section id="admin-ejercicios" className="content-section active">
            <h2>Gestión de Ejercicios</h2>
            <div className="search-container">
              <input type="search" placeholder="Buscar por nombre o grupo muscular..." />
            </div>
            <div id="ejercicios-list-container">
              <button 
                className="btn-neon btn-add" 
                style={{ marginBottom: '20px', width: 'auto', padding: '0.8rem 1.5rem' }}
                onClick={handleAddEjercicio}
              >
                Añadir Ejercicio
              </button>
              <div className="table-wrapper">
                {loading && ejercicios.length === 0 ? (
                  <div className="spinner-container">
                    <div className="spinner-large"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--secondary-color)' }}>Cargando ejercicios...</p>
                  </div>
                ) : ejercicios.length === 0 ? (
                  <p>No hay ejercicios registrados</p>
                ) : (
                  <>
                    {/* Vista móvil */}
                    <div className="mobile-admin-list">
                      {ejercicios.map((ejercicio) => (
                        <div key={ejercicio._id} className="mobile-admin-item">
                          <div className="mobile-admin-item-text">
                            {ejercicio.nombre}
                          </div>
                          <div className="mobile-admin-item-actions">
                            <button 
                              className="btn-icon btn-edit" 
                              onClick={() => handleEditEjercicio(ejercicio)}
                              title="Editar ejercicio"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-icon btn-delete"
                              onClick={() => handleDeleteEjercicio(ejercicio._id)}
                              title="Eliminar ejercicio"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Vista desktop */}
                    <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Grupo Muscular</th>
                        <th>Dificultad</th>
                        <th>Equipamiento</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ejercicios.map((ejercicio) => (
                        <tr key={ejercicio._id}>
                          <td>{ejercicio.nombre}</td>
                          <td style={{textTransform: 'capitalize'}}>{ejercicio.grupoMuscular}</td>
                          <td style={{textTransform: 'capitalize'}}>{ejercicio.dificultad}</td>
                          <td style={{textTransform: 'capitalize'}}>{ejercicio.equipamiento}</td>
                          <td style={{maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {ejercicio.descripcion || '-'}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-icon btn-edit" 
                                onClick={() => handleEditEjercicio(ejercicio)}
                                title="Editar ejercicio"
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-icon btn-delete"
                                onClick={() => handleDeleteEjercicio(ejercicio._id)}
                                title="Eliminar ejercicio"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'guias' && (
          <section id="admin-guias" className="content-section active">
            <h2>Gestión de Guías</h2>
            <div className="search-container">
              <input type="search" placeholder="Buscar por título u objetivo..." />
            </div>
            <div id="guias-list-container">
              <button 
                className="btn-neon btn-add" 
                style={{ marginBottom: '20px', width: 'auto', padding: '0.8rem 1.5rem' }}
                onClick={handleAddGuia}
              >
                Añadir Guía
              </button>
              <div className="table-wrapper">
                {loading && guias.length === 0 ? (
                  <div className="spinner-container">
                    <div className="spinner-large"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--secondary-color)' }}>Cargando guías...</p>
                  </div>
                ) : guias.length === 0 ? (
                  <p>No hay guías registradas</p>
                ) : (
                  <>
                    {/* Vista móvil */}
                    <div className="mobile-admin-list">
                      {guias.map((guia) => (
                        <div key={guia._id} className="mobile-admin-item">
                          <div className="mobile-admin-item-text">
                            {guia.titulo}
                          </div>
                          <div className="mobile-admin-item-actions">
                            <button 
                              className="btn-icon btn-edit" 
                              onClick={() => handleEditGuia(guia)}
                              title="Editar guía"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-icon btn-delete"
                              onClick={() => handleDeleteGuia(guia._id)}
                              title="Eliminar guía"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Vista desktop */}
                    <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Objetivo</th>
                        <th>Estado</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guias.map((guia) => (
                        <tr key={guia._id}>
                          <td>{guia.titulo}</td>
                          <td style={{textTransform: 'capitalize'}}>{guia.objetivo.replace(/_/g, ' ')}</td>
                          <td>
                            {guia.activa ? '✅ Activa' : '❌ Inactiva'}
                          </td>
                          <td style={{maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {guia.descripcion || '-'}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-icon btn-edit" 
                                onClick={() => handleEditGuia(guia)}
                                title="Editar guía"
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-icon btn-delete"
                                onClick={() => handleDeleteGuia(guia._id)}
                                title="Eliminar guía"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </>
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
                min="14"
                max="100"
                placeholder="14-100 años"
              />
            </div>
            <div className="form-group">
              <label>Sexo</label>
              <select
                value={userForm.sexo}
                onChange={(e) => setUserForm({ ...userForm, sexo: e.target.value })}
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Objetivo</label>
              <select
                value={userForm.objetivo}
                onChange={(e) => setUserForm({ ...userForm, objetivo: e.target.value })}
              >
                <option value="aumento_masa_muscular">Aumento de Masa Muscular</option>
                <option value="recomposicion_corporal">Recomposición Corporal</option>
                <option value="perdida_grasa">Pérdida de Grasa</option>
              </select>
            </div>
            <div className="form-group">
              <label>Rol *</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <option value="user">Usuario</option>
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

      {/* Modal para añadir/editar ejercicio */}
      {showEjercicioModal && (
        <div className="modal-overlay" onClick={() => setShowEjercicioModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingEjercicio ? 'Editar Ejercicio' : 'Añadir Ejercicio'}</h2>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={ejercicioForm.nombre}
                onChange={(e) => setEjercicioForm({ ...ejercicioForm, nombre: e.target.value })}
                required
                placeholder="Ej: Press de banca"
              />
            </div>
            <div className="form-group">
              <label>Grupo Muscular *</label>
              <select
                value={ejercicioForm.grupoMuscular}
                onChange={(e) => setEjercicioForm({ ...ejercicioForm, grupoMuscular: e.target.value })}
              >
                <option value="pecho">Pecho</option>
                <option value="espalda">Espalda</option>
                <option value="piernas">Piernas</option>
                <option value="hombros">Hombros</option>
                <option value="brazos">Brazos</option>
                <option value="core">Core</option>
                <option value="cardio">Cardio</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dificultad *</label>
              <select
                value={ejercicioForm.dificultad}
                onChange={(e) => setEjercicioForm({ ...ejercicioForm, dificultad: e.target.value })}
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Equipamiento *</label>
              <select
                value={ejercicioForm.equipamiento}
                onChange={(e) => setEjercicioForm({ ...ejercicioForm, equipamiento: e.target.value })}
              >
                <option value="casa">En casa</option>
                <option value="gimnasio">Gimnasio</option>
              </select>
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={ejercicioForm.descripcion}
                onChange={(e) => setEjercicioForm({ ...ejercicioForm, descripcion: e.target.value })}
                rows="4"
                placeholder="Describe la técnica del ejercicio..."
              />
            </div>
            <div className="form-group">
              <label>Imagen de Técnica</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    setEjercicioForm({ ...ejercicioForm, imagenTecnica: file })
                  }
                }}
              />
              {ejercicioForm.imagenTecnica instanceof File && (
                <p style={{marginTop: '0.5rem', color: 'var(--secondary-color)', fontSize: '0.9rem'}}>
                  ✅ {ejercicioForm.imagenTecnica.name}
                </p>
              )}
              {editingEjercicio && editingEjercicio.imagenTecnica && !(ejercicioForm.imagenTecnica instanceof File) && (
                <p style={{marginTop: '0.5rem', color: 'var(--text-color-dark)', fontSize: '0.9rem'}}>
                  Imagen actual: {editingEjercicio.imagenTecnica.split('/').pop()}
                </p>
              )}
            </div>
            <div className="modal-buttons">
              <button className="btn-action" onClick={handleSaveEjercicio}>
                {editingEjercicio ? 'Actualizar' : 'Crear'}
              </button>
              <button className="btn-action" onClick={() => setShowEjercicioModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para añadir/editar guía */}
      {showGuiaModal && (
        <div className="modal-overlay" onClick={() => setShowGuiaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingGuia ? 'Editar Guía' : 'Añadir Guía'}</h2>
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                value={guiaForm.titulo}
                onChange={(e) => setGuiaForm({ ...guiaForm, titulo: e.target.value })}
                required
                placeholder="Ej: Hábitos de Alimentación para..."
              />
            </div>
            <div className="form-group">
              <label>Objetivo *</label>
              <select
                value={guiaForm.objetivo}
                onChange={(e) => setGuiaForm({ ...guiaForm, objetivo: e.target.value })}
              >
                <option value="aumento_masa_muscular">Aumento de Masa Muscular</option>
                <option value="recomposicion_corporal">Recomposición Corporal</option>
                <option value="perdida_grasa">Pérdida de Grasa</option>
                <option value="todos">Todos los Objetivos</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                value={guiaForm.activa}
                onChange={(e) => setGuiaForm({ ...guiaForm, activa: e.target.value === 'true' })}
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={guiaForm.descripcion}
                onChange={(e) => setGuiaForm({ ...guiaForm, descripcion: e.target.value })}
                rows="4"
                placeholder="Describe el contenido de la guía..."
              />
            </div>
            <div className="form-group">
              <label>Archivo PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    setGuiaForm({ ...guiaForm, archivoPdf: file })
                  }
                }}
              />
              {guiaForm.archivoPdf instanceof File && (
                <p style={{marginTop: '0.5rem', color: 'var(--secondary-color)', fontSize: '0.9rem'}}>
                  ✅ {guiaForm.archivoPdf.name}
                </p>
              )}
              {editingGuia && editingGuia.archivoUrl && !(guiaForm.archivoPdf instanceof File) && (
                <p style={{marginTop: '0.5rem', color: 'var(--text-color-dark)', fontSize: '0.9rem'}}>
                  Archivo actual: {editingGuia.archivoUrl.split('/').pop()}
                </p>
              )}
            </div>
            <div className="modal-buttons">
              <button className="btn-action" onClick={handleSaveGuia}>
                {editingGuia ? 'Actualizar' : 'Crear'}
              </button>
              <button className="btn-action" onClick={() => setShowGuiaModal(false)}>
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
