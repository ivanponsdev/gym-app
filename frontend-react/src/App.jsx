import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Info from './pages/Info'
import ProtectedRoute from './components/ProtectedRoute'
import AccesibilidadWidget from './components/AccesibilidadWidget'
import SkipLink from './components/SkipLink'
import './styles/accesible.css'
import './styles/accessibility-tooltip.css'
function AppContent() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/info" element={<Info />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Rutas protegidas para usuarios standart */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas protegidas para admin */}
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
  )
}

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <Router>
          <SkipLink />
          <div id="main-content" tabIndex={-1}>
            <AppContent />
          </div>
          <AccesibilidadWidget />
        </Router>
      </AuthProvider>
    </AccessibilityProvider>
  )
}

export default App
