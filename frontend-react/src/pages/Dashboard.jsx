import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div id="app-container">
      <aside className="sidebar">
        <h1 className="logo-sidebar">ULTIMATE GYM</h1>
        <nav>
          <a
            href="#"
            className={`nav-link ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveSection('profile')
            }}
          >
            Mi Perfil
          </a>
        </nav>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </aside>
      <main className="content">
        <section id="profile" className="content-section active">
          <h2>Tu Perfil</h2>
          <div className="card">
            <div id="profile-display">
              <h3>Información Personal</h3>
              <p>
                <strong>Nombre:</strong> <span>{user?.nombre || 'Usuario'}</span>
              </p>
              <p>
                <strong>Email:</strong> <span>{user?.email || 'email@example.com'}</span>
              </p>
              <p>
                <strong>Edad:</strong> <span>{user?.edad || '-'}</span> años
              </p>
              <p>
                <strong>Sexo:</strong> <span>{user?.sexo || '-'}</span>
              </p>
              <p>
                <strong>Objetivo:</strong> <span>{user?.objetivo || '-'}</span>
              </p>
              <button className="btn-secondary-neon" style={{ marginTop: '1rem', width: 'auto', padding: '0.8rem 1.2rem' }}>
                Editar Perfil
              </button>
            </div>
          </div>
        </section>
      </main>

      <button 
        className="btn-exit"
        onClick={() => navigate('/')}
      >
        Salir
      </button>
    </div>
  )
}

export default Dashboard
