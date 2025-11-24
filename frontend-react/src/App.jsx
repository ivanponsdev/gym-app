import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Info from './pages/Info'
import ProtectedRoute from './components/ProtectedRoute'

const ExitButton = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // No mostrar el botón en la página principal
  if (location.pathname === '/') {
    return null
  }
  
  return (
    <button 
      className="exit-button"
      onClick={() => navigate('/')}
    >
      Salir
    </button>
  )
}

function AppContent() {
  return (
    <>
      <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/info" element={<Info />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Rutas protegidas para usuarios normales */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas protegidas para administradores */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirección para rutas no encontradas, evitando ventanas de error */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      <ExitButton />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
