const Usuario = require('../models/Usuario');
const Guia = require('../models/Guia');
const axios = require('axios');

// Enviar guías por email a través de n8n
exports.sendGuidesEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Obtener usuario autenticado
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener guías del usuario (filtradas por objetivo)
    const filtro = usuario.objetivo 
      ? {
          activa: true,
          $or: [
            { objetivo: usuario.objetivo },
            { objetivo: 'todos' }
          ]
        }
      : {
          activa: true,
          objetivo: 'todos'
        };

    const guias = await Guia.find(filtro);

    if (guias.length === 0) {
      return res.status(400).json({ 
        error: 'No hay guías disponibles para enviar' 
      });
    }

    // Preparar datos para enviar a n8n
    const datosN8n = {
      userEmail: usuario.email,
      userName: usuario.nombre,
      userObjectivo: usuario.objetivo,
      guias: guias.map(g => ({
        titulo: g.titulo,
        descripcion: g.descripcion,
        objetivo: g.objetivo,
        archivoUrl: g.archivoUrl,
        fullUrl: `${process.env.BACKEND_URL || 'http://localhost:5001'}/${g.archivoUrl}`
      }))
    };

    // Llamar al webhook de n8n
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      return res.status(500).json({ 
        error: 'Webhook de n8n no configurado' 
      });
    }

    await axios.post(n8nWebhookUrl, datosN8n);

    res.json({ 
      success: true, 
      message: `Email enviado a ${usuario.email} con ${guias.length} guía(s)` 
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ 
      error: 'Error al enviar email',
      details: error.message 
    });
  }
};

// Obtener estado del último envío
exports.getLastEmailStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Placeholder 
    res.json({ 
      status: 'success',
      lastSend: new Date(),
      message: 'Función disponible para expansión futura'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
