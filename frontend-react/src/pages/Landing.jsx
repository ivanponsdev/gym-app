import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <>
      {/* Logo flotante en esquina - fuera del contenedor flex */}
      <div className="floating-logo-landing">
        <img src="/Sporty Online Gym Logo featuring 'UG' (1).png" alt="Ultimate Gym Logo" />
      </div>

      <div id="landing-container" className="container">
        <h1>Bienvenido a</h1>
        <div className="logo">ULTIMATE GYM</div>
        <p>Donde cada esfuerzo cuenta para tu mejor versión.</p>
        <div className="landing-buttons">
          <button
            className="btn-action"
            onClick={() => navigate('/auth')}
          >
            Comenzar
          </button>
          <button
            className="btn-action"
            onClick={() => navigate('/info')}
          >
            Información
          </button>
        </div>
      </div>
    </>
  )
}

export default Landing
