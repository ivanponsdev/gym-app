import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import Notification from '../components/Notification'
import FloatingLogo from '../components/FloatingLogo'

const Auth = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showLogin, setShowLogin] = useState(true)
  const [notification, setNotification] = useState(null)

  // Estados del formulario de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // Estados del formulario de registro
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // Estados para errores de validación en tiempo real
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: ''
  })

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Validar nombre en tiempo real
  const validateName = (name) => {
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+\s+[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    if (!name.trim()) {
      return ''
    }
    if (!nombreRegex.test(name.trim())) {
      return 'El nombre debe contener al menos nombre y apellido (mínimo 2 palabras)'
    }
    return ''
  }

  // Validar email en tiempo real
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!email) {
      return ''
    }
    if (!emailRegex.test(email) || email.endsWith('.') || email.includes('..')) {
      return 'El formato del email no es válido. Ej: usuario@dominio.com'
    }
    return ''
  }

  // Validar contraseña en tiempo real
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!password) {
      return ''
    }
    if (!passwordRegex.test(password)) {
      return 'Al menos 8 caracteres, una mayúscula, una minúscula y un número'
    }
    return ''
  }

  const handleRegisterInputChange = (field, value) => {
    setRegisterData({ ...registerData, [field]: value })
    
    // Validar en tiempo real
    if (field === 'name') {
      setValidationErrors({ ...validationErrors, name: validateName(value) })
    } else if (field === 'email') {
      setValidationErrors({ ...validationErrors, email: validateEmail(value) })
    } else if (field === 'password') {
      setValidationErrors({ ...validationErrors, password: validatePassword(value) })
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      const data = await authAPI.login(loginData.email, loginData.password)
      login(data.usuario, data.token)
      showNotification('¡Bienvenido de nuevo!', 'success')
      
      // Redirigir según el rol
      setTimeout(() => {
        navigate(data.usuario.role === 'admin' ? '/admin' : '/dashboard')
      }, 1000)
    } catch (error) {
      showNotification(error.message || 'Error al iniciar sesión', 'error')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Validar nombre (mínimo 2 palabras)
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+\s+[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    if (!nombreRegex.test(registerData.name.trim())) {
      showNotification('El nombre debe contener al menos nombre y apellido (mínimo 2 palabras)', 'error')
      return
    }

    // Validar email
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(registerData.email) || registerData.email.endsWith('.') || registerData.email.includes('..')) {
      showNotification('El formato del email no es válido. Asegúrate de que tenga el formato: usuario@dominio.com', 'error')
      return
    }
    
    // Validar contraseña robusta en frontend
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(registerData.password)) {
      showNotification('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número', 'error')
      return
    }
    
    try {
      const data = await authAPI.register(
        registerData.name,
        registerData.email,
        registerData.password
      )
      login(data.usuario, data.token)
      // Limpiar cache de usuarios del admin después de registrarse
      sessionStorage.removeItem('adminUsers')
      showNotification('¡Cuenta creada con éxito!', 'success')
      
      // Redirigir a la página de perfil
      setTimeout(() => {
        navigate('/dashboard/perfil')
      }, 1000)
    } catch (error) {
      showNotification(error.message || 'Error al registrarse', 'error')
    }
  }

  return (
    <>
      <FloatingLogo />
      <div id="auth-container" className="container">
        <div className="form-container">
          {/* Formulario de inicio de sesión */}
          {showLogin ? (
            <form id="login-form" onSubmit={handleLogin}>
              <h2>Iniciar Sesión</h2>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Correo electrónico"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-neon">Entrar</button>
              <p className="form-switch">
                ¿No tienes cuenta?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(false); }}>
                  Regístrate
                </a>
              </p>
            </form>
          ) : (
            /* Formulario de registro */
            <form id="register-form" onSubmit={handleRegister}>
              <h2>Crear Cuenta</h2>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={registerData.name}
                  onChange={(e) => handleRegisterInputChange('name', e.target.value)}
                  required
                />
                {validationErrors.name && <span className="error-message">{validationErrors.name}</span>}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Correo electrónico"
                  value={registerData.email}
                  onChange={(e) => handleRegisterInputChange('email', e.target.value)}
                  required
                />
                {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={registerData.password}
                  onChange={(e) => handleRegisterInputChange('password', e.target.value)}
                  required
                />
                {validationErrors.password && <span className="error-message">{validationErrors.password}</span>}
              </div>
              <button type="submit" className="btn-neon">Registrarse</button>
              <p className="form-switch">
                ¿Ya tienes cuenta?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>
                  Inicia Sesión
                </a>
              </p>
            </form>
          )}
        </div>
        <button 
          className="btn-back"
          onClick={() => navigate('/')}
        >
          ← Volver
        </button>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  )
}

export default Auth
