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
      <button className="exit-button" onClick={handleLogout}>
        Salir
      </button>
    </aside>
  )
}

export default Sidebar
