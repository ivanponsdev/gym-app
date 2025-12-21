const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// Middleware: authenticate JWT if present in Authorization header
function authenticateJWT(req, res, next) {
  // Buscar header con case-insensitive
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || req.get('Authorization');
  
  if (!authHeader) {
    console.log('❌ No se encontró token en headers:', Object.keys(req.headers));
    return res.status(401).json({ message: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('❌ Formato de token inválido:', authHeader);
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload expected to contain at least { id, role }
    req.user = payload;
    console.log('✅ Usuario autenticado:', payload.id, payload.role);
    return next();
  } catch (err) {
    console.log('❌ Error verificando token:', err.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

// Middleware: require admin role (assumes authenticateJWT ran before)
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acceso denegado: admin requerido' });
  return next();
}

module.exports = { authenticateJWT, requireAdmin };