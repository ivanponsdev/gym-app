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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
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
    
    try {
      const data = await authAPI.register(
        registerData.name,
        registerData.email,
        registerData.password
      )
      login(data.usuario, data.token)
      showNotification('¡Cuenta creada con éxito!', 'success')
      
      // Redirigir al dashboard
      setTimeout(() => {
        navigate('/dashboard')
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
                  type="email"
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
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
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
