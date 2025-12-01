import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ activeSection, setActiveSection, menuItems }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-container">
        <img
          src="/Sporty Online Gym Logo featuring 'UG' (1).png"
          alt="Ultimate Gym Logo"
          className="sidebar-logo-img"
        />
      </div>
      <h1 className="logo-sidebar">ULTIMATE GYM</h1>
      <nav>
        {menuItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={activeSection === item.id ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault()
              setActiveSection(item.id)
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-actions">
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
        <button className="btn-exit-sidebar" onClick={() => navigate('/')}>
          Salir
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
