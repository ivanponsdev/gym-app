import React from 'react'

export const EjercicioCard = ({ ejercicio }) => {
  return (
    <div className="card ejercicio-card">
      <div className="equipamiento-icon">
        {ejercicio.equipamiento === 'casa' ? '🏠' : '🏋️'}
      </div>
      <h3>{ejercicio.nombre}</h3>
      <div className="ejercicio-tags">
        <span className="tag-grupo">{ejercicio.grupoMuscular}</span>
        <span className={`tag-dificultad ${ejercicio.dificultad}`}>{ejercicio.dificultad}</span>
      </div>
      <div className="ejercicio-descripcion">
        <p>{ejercicio.descripcion}</p>
      </div>
    </div>
  )
}

export const GuiaCard = ({ guia, descargarGuia, formatearObjetivo, obtenerColorObjetivo }) => {
  return (
    <div className="card guia-card">
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
  )
}

export const ClaseCard = ({ clase, user, misClases, handleInscribirse }) => {
  // Lógica de cálculo de plazas y estado
  const plazasDisponibles = clase.plazasDisponibles ?? (clase.cupoMaximo - (clase.alumnosApuntados?.length || 0))
  const porcentajeOcupacion = ((clase.cupoMaximo - plazasDisponibles) / clase.cupoMaximo) * 100
  
  let estadoCupo = 'disponible'
  if (porcentajeOcupacion >= 100) estadoCupo = 'completo'
  else if (porcentajeOcupacion >= 80) estadoCupo = 'casi-lleno'

  const estaInscrito = clase.alumnosApuntados?.includes(user?._id) || 
    misClases.some(c => c._id === clase._id)

  return (
    <div className={`clase-card tipo-${clase.nombre.toLowerCase().replace(/\s/g, '-')}`}> 
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
  )
}
