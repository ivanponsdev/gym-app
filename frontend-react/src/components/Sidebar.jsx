import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ activeSection, setActiveSection, menuItems }) => {
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
    </aside>
  )
}

export default Sidebar
