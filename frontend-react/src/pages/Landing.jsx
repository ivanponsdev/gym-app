import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const Landing = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard correspondiente
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/dashboard')
    }
  }, [isAuthenticated, isAdmin, navigate])

  return (
    <div id="landing-container" className="container">
      <h1>Bienvenido a</h1>
      <div className="logo">ULTIMATE GYM</div>
      <p>Donde cada esfuerzo cuenta para tu mejor versión.</p>
      <div className="landing-buttons">
        <button 
          className="btn-neon"
          onClick={() => navigate('/auth')}
        >
          Comenzar
        </button>
        <button 
          className="btn-secondary-neon"
          onClick={() => navigate('/info')}
        >
          Información
        </button>
      </div>
    </div>
  )
}

export default Landing
