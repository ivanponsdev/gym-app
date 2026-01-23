import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAccessibility } from '../context/AccessibilityContext'

const Sidebar = ({ activeSection, setActiveSection, menuItems }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { isAccessible } = useAccessibility()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="sidebar" role="complementary" aria-label="Navegación principal del sitio">
      <div className="sidebar-logo-container">
        <img
          src="/Sporty Online Gym Logo featuring 'UG' (1).png"
          alt="Ultimate Gym Logo"
          className="sidebar-logo-img"
        />
      </div>
      <h1 className="logo-sidebar">ULTIMATE GYM</h1>
      <nav aria-label="Menú de navegación" role="navigation">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={activeSection === item.id ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault()
              setActiveSection(item.id)
            }}
            aria-current={activeSection === item.id ? "page" : undefined}
            aria-label={isAccessible ? `${item.label} ${activeSection === item.id ? '(actual)' : ''}` : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-actions">
        <button 
          className="btn-logout" 
          onClick={handleLogout}
          aria-label="Cerrar sesión y volver a la página de inicio"
        >
          Cerrar Sesión
        </button>
        <button 
          className="btn-exit-sidebar" 
          onClick={() => navigate('/')}
          aria-label="Salir de la aplicación"
        >
          Salir
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
