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
        inscritos: found ? found.inscritos : 0,
        mediaInscritos: found && found.cantidad > 0 ? Math.round((found.inscritos / found.cantidad) * 10) / 10 : 0
      }
    })

    // Horas más populares (por número de inscritos)
    const horasPopulares = await Clase.aggregate([
      {
        $group: {
          _id: '$horaInicio',
          totalInscritos: { 
            $sum: {
              $cond: {
                if: { $isArray: '$alumnosApuntados' },
                then: { $size: '$alumnosApuntados' },
                else: 0
              }
            }
          },
          cantidadClases: { $sum: 1 }
        }
      },
      { $sort: { totalInscritos: -1 } },
      { $limit: 5 }
    ])

    // Usuarios por sexo (activos solamente)
    const usuariosPorSexo = await Usuario.aggregate([
      {
        $match: { fechaBaja: null } // Solo usuarios activos
      },
      {
        $group: {
          _id: '$sexo',
          count: { $sum: 1 }
        }
      }
    ])

    // Asegurar que siempre aparezcan los 3 géneros
    const sexos = ['masculino', 'femenino', 'otro']
    const sexoFormateado = sexos.map(sexo => {
      const found = usuariosPorSexo.find(item => item._id === sexo)
      return {
        sexo: sexo === 'masculino' ? 'Hombres' : sexo === 'femenino' ? 'Mujeres' : 'Otros',
        cantidad: found ? found.count : 0
      }
    })

    // Evolución temporal de usuarios por grupo de edad
    // Primero obtenemos todos los usuarios con su grupo de edad y fecha
    const usuariosConGrupoEdad = await Usuario.aggregate([
      {
        $project: {
          createdAt: 1,
          fechaBaja: 1,
          edad: { $ifNull: ['$edad', 30] }, // Usar 30 como edad por defecto si no existe
          grupoEdad: {
            $cond: [
              { $lt: [{ $ifNull: ['$edad', 30] }, 30] },
              '18-29',
              {
                $cond: [
                  { $lt: [{ $ifNull: ['$edad', 30] }, 45] },
                  '30-44',
                  '45+'
                ]
              }
            ]
          }
        }
      }
    ])

    // Crear estructura de meses desde el primer usuario hasta ahora
    const usuariosConFecha = usuariosConGrupoEdad.filter(u => u.createdAt)
    if (usuariosConFecha.length === 0) {
      // Si no hay usuarios, no calcular evolución
      var mesesEvolucion = []
    } else {
      const primeraFecha = new Date(Math.min(...usuariosConFecha.map(u => new Date(u.createdAt).getTime())))
      const fechaActual = new Date()
      var mesesEvolucion = []
      
      for (let d = new Date(primeraFecha.getFullYear(), primeraFecha.getMonth(), 1); 
           d <= fechaActual; 
           d.setMonth(d.getMonth() + 1)) {
        const year = d.getFullYear()
        const month = d.getMonth() + 1
        const key = `${year}-${String(month).padStart(2, '0')}`
        
        // Contar usuarios activos de cada grupo en este mes
        const gruposCounts = { '18-29': 0, '30-44': 0, '45+': 0 }
        
        usuariosConGrupoEdad.forEach(usuario => {
          const altaFecha = new Date(usuario.createdAt)
          const bajaFecha = usuario.fechaBaja ? new Date(usuario.fechaBaja) : null
          
          // Usuario está activo en este mes si:
          // - Se dio de alta antes o durante este mes
          // - Y no se ha dado de baja, o se dio de baja después de este mes
          if (altaFecha <= new Date(year, month, 0) && 
              (!bajaFecha || bajaFecha > new Date(year, month - 1, 1))) {
            gruposCounts[usuario.grupoEdad]++
          }
        })
        
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        mesesEvolucion.push({
          mes: `${meses[month - 1]} ${year}`,
          '18-29': gruposCounts['18-29'],
          '30-44': gruposCounts['30-44'],
          '45+': gruposCounts['45+']
        })
      }
    }


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
      horasPopulares: horasPopulares.map(hora => ({
        hora: hora._id,
        inscritos: hora.totalInscritos,
        clases: hora.cantidadClases
      })),
      clasesPorDia: clasesPorDiaOrdenado,
      usuariosPorSexo: sexoFormateado,
      evolucionPorGrupoEdad: mesesEvolucion
    })
  } catch (error) {
    console.error('Error al obtener estadísticas globales:', error)
    res.status(500).json({ mensaje: 'Error al obtener estadísticas globales', error: error.message })
  }
}
