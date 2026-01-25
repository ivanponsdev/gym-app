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

export const GuiaCard = ({ guia, descargarGuia, formatearObjetivo, obtenerColorObjetivo, enviarGuiaEmail }) => {
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
        {enviarGuiaEmail && (
          <button 
            className="btn-neon btn-email"
            onClick={() => enviarGuiaEmail()}
            title="Enviar guías por email"
            style={{ marginLeft: '0.5rem' }}
          >
            ✉️ Enviar por Email
          </button>
        )}
      </div>
    </div>
  )
}

export const ClaseCard = ({ clase, user, misClases, handleInscribirse }) => {
  // Función para verificar si la clase ya pasó considerando día y hora
  const esClasePasada = () => {
    const ahora = new Date()
    const diaActual = ahora.getDay() // Número del día 
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
    
    // Convertir nombre del día a número
    const diasMap = {
      'domingo': 0,
      'lunes': 1,
      'martes': 2,
      'miércoles': 3,
      'jueves': 4,
      'viernes': 5,
      'sábado': 6
    }
    
    const diaClase = diasMap[clase.diaSemana.toLowerCase()] ?? -1
    
    // Si el día de la clase ya pasó esta semana devuelve true = pasada
    if (diaClase < diaActual) {
      return true
    }
    // Si es el mismo día, comparar horas
    if (diaClase === diaActual && clase.horaInicio <= horaActual) {
      return true
    }
    return false
  }

  // Lógica de cálculo de plazas y estado
  const plazasDisponibles = clase.plazasDisponibles ?? (clase.cupoMaximo - (clase.alumnosApuntados?.length || 0))
  const porcentajeOcupacion = ((clase.cupoMaximo - plazasDisponibles) / clase.cupoMaximo) * 100
  
  let estadoCupo = 'disponible'
  if (porcentajeOcupacion >= 100) estadoCupo = 'completo'
  else if (porcentajeOcupacion >= 80) estadoCupo = 'casi-lleno'

  const estaInscrito = clase.alumnosApuntados?.includes(user?._id) || 
    misClases.some(c => c._id === clase._id)

  const clasePasada = esClasePasada()

  return (
    <div className={`clase-card tipo-${clase.nombre.toLowerCase().replace(/\s/g, '-')} ${clasePasada ? 'clase-pasada' : ''}`}> 
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
        disabled={estadoCupo === 'completo' || estaInscrito || clasePasada}
        title={clasePasada ? 'Esta clase ya ha pasado' : ''}
      >
        {clasePasada ? '⏰ Clase Pasada' :
          estaInscrito ? '✓ Inscrito' : 
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
