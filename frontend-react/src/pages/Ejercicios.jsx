import { useState, useEffect } from 'react'
import { ejerciciosAPI } from '../services/api'

function Ejercicios() {
  const [ejercicios, setEjercicios] = useState([])
  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Estados para filtros
  const [filtroGrupo, setFiltroGrupo] = useState('')
  const [filtroEquipamiento, setFiltroEquipamiento] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // Opciones para filtros
  const gruposMusculares = [
    'pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core', 'cardio'
  ]

  // Cargar ejercicios al montar componente
  useEffect(() => {
    cargarEjercicios()
  }, [])

  // Aplicar filtros cuando cambien
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

    // Filtrar por grupo muscular
    if (filtroGrupo) {
      filtrados = filtrados.filter(ej => ej.grupoMuscular === filtroGrupo)
    }

    // Filtrar por equipamiento
    if (filtroEquipamiento) {
      filtrados = filtrados.filter(ej => ej.equipamiento === filtroEquipamiento)
    }

    // Filtrar por búsqueda
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

  const obtenerColorGrupo = (grupo) => {
    const colores = {
      pecho: '#e74c3c',
      espalda: '#3498db',
      piernas: '#2ecc71',
      hombros: '#f39c12',
      brazos: '#9b59b6',
      core: '#e67e22',
      cardio: '#1abc9c'
    }
    return colores[grupo] || '#95a5a6'
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando ejercicios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={cargarEjercicios} className="btn-primary">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="ejercicios-page">
      <div className="ejercicios-header">
        <h1>💪 Biblioteca de Ejercicios</h1>
        <p>Descubre ejercicios organizados por grupo muscular y equipamiento</p>
      </div>

      {/* Filtros */}
      <div className="filtros-ejercicios">
        <div className="filtro-grupo">
          <input
            type="text"
            placeholder="🔍 Buscar ejercicios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filtro-selects">
          <select 
            value={filtroGrupo} 
            onChange={(e) => setFiltroGrupo(e.target.value)}
            className="filter-select"
          >
            <option value="">🎯 Todos los grupos</option>
            {gruposMusculares.map(grupo => (
              <option key={grupo} value={grupo}>
                {grupo.charAt(0).toUpperCase() + grupo.slice(1)}
              </option>
            ))}
          </select>

          <select 
            value={filtroEquipamiento} 
            onChange={(e) => setFiltroEquipamiento(e.target.value)}
            className="filter-select"
          >
            <option value=""> Cualquier lugar</option>
            <option value="casa">🏠 En casa</option>
            <option value="gimnasio">🏋️ Gimnasio</option>
          </select>

          {(filtroGrupo || filtroEquipamiento || busqueda) && (
            <button onClick={limpiarFiltros} className="btn-clear-filters">
              ✕ Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="resultados-info">
        <span>
          {ejerciciosFiltrados.length} ejercicio{ejerciciosFiltrados.length !== 1 ? 's' : ''} 
          {ejerciciosFiltrados.length !== ejercicios.length && ` de ${ejercicios.length} totales`}
        </span>
      </div>

      {/* Lista de ejercicios */}
      <div className="ejercicios-grid">
        {ejerciciosFiltrados.length > 0 ? (
          ejerciciosFiltrados.map(ejercicio => (
            <div key={ejercicio._id} className="card">
              <div className="ejercicio-header">
                <h3>{ejercicio.nombre}</h3>
                <div className="ejercicio-tags">
                  <span 
                    className="tag-grupo" 
                    style={{ backgroundColor: obtenerColorGrupo(ejercicio.grupoMuscular) }}
                  >
                    {ejercicio.grupoMuscular}
                  </span>
                  <span className={`tag-equipamiento ${ejercicio.equipamiento}`}>
                    {ejercicio.equipamiento === 'casa' ? '🏠' : '🏋️'} {ejercicio.equipamiento}
                  </span>
                  <span className={`tag-dificultad ${ejercicio.dificultad}`}>
                    {ejercicio.dificultad}
                  </span>
                </div>
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
            <button onClick={limpiarFiltros} className="btn-primary">
              Ver todos los ejercicios
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Ejercicios