const Usuario = require('../models/Usuario')
const Clase = require('../models/Clase')

// Obtener estadísticas globales (solo admin)
exports.obtenerEstadisticasGlobales = async (req, res) => {
  try {
    const totalUsuarios = await Usuario.countDocuments()
    const totalClases = await Clase.countDocuments()
    
    // Usuarios por objetivo
    const usuariosPorObjetivo = await Usuario.aggregate([
      {
        $group: {
          _id: '$objetivo',
          count: { $sum: 1 }
        }
      }
    ])

    // Formatear nombres de objetivos
    const formatearObjetivo = (objetivo) => {
      const nombres = {
        aumento_masa_muscular: 'Aumento Masa Muscular',
        recomposicion_corporal: 'Recomposición Corporal',
        perdida_grasa: 'Pérdida de Grasa',
        null: 'Sin Objetivo'
      }
      return nombres[objetivo] || 'Otro'
    }

    // Clases más populares (por número de inscritos)
    const clasesPopulares = await Clase.aggregate([
      {
        $project: {
          nombre: 1,
          diaSemana: 1,
          horaInicio: 1,
          inscritos: { 
            $cond: {
              if: { $isArray: '$alumnosApuntados' },
              then: { $size: '$alumnosApuntados' },
              else: 0
            }
          }
        }
      },
      { $sort: { inscritos: -1 } },
      { $limit: 10 }
    ])

    // Total de inscripciones en el sistema
    const totalInscripciones = await Clase.aggregate([
      {
        $project: {
          numInscritos: { 
            $cond: {
              if: { $isArray: '$alumnosApuntados' },
              then: { $size: '$alumnosApuntados' },
              else: 0
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$numInscritos' }
        }
      }
    ])

    // Distribución de clases por día
    const clasesPorDia = await Clase.aggregate([
      {
        $group: {
          _id: '$diaSemana',
          cantidad: { $sum: 1 },
          inscritos: { 
            $sum: {
              $cond: {
                if: { $isArray: '$alumnosApuntados' },
                then: { $size: '$alumnosApuntados' },
                else: 0
              }
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const ordenDias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
    const clasesPorDiaOrdenado = ordenDias.map(dia => {
      const found = clasesPorDia.find(item => item._id === dia)
      return {
        dia: dia.charAt(0).toUpperCase() + dia.slice(1),
        cantidad: found ? found.cantidad : 0,
        inscritos: found ? found.inscritos : 0
      }
    })

    res.json({
      totalUsuarios,
      totalClases,
      totalInscripciones: totalInscripciones[0]?.total || 0,
      promedioInscritosPorClase: totalClases > 0 
        ? Math.round((totalInscripciones[0]?.total || 0) / totalClases) 
        : 0,
      usuariosPorObjetivo: usuariosPorObjetivo
        .map(item => ({
          name: formatearObjetivo(item._id),
          value: item.count
        }))
        .sort((a, b) => b.value - a.value),
      clasesPopulares: clasesPopulares.map(clase => ({
        nombre: clase.nombre,
        inscritos: clase.inscritos,
        dia: clase.diaSemana,
        hora: clase.horaInicio
      })),
      clasesPorDia: clasesPorDiaOrdenado
    })
  } catch (error) {
    console.error('Error al obtener estadísticas globales:', error)
    res.status(500).json({ mensaje: 'Error al obtener estadísticas globales', error: error.message })
  }
}
