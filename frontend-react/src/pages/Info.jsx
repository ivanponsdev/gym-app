import { useNavigate } from 'react-router-dom'

const Info = () => {
  const navigate = useNavigate()

  return (
    <div id="info-container" className="container">
      <div className="info-card">
        <h2>Información y Horarios</h2>
        <div className="info-section">
          <h3>Ubicación</h3>
          <p>Calle Falsa, 123, Villena, Alicante</p>
        </div>
        <div className="info-section">
          <h3>Horarios</h3>
          <table>
            <tbody>
              <tr>
                <td>Lunes - Viernes</td>
                <td>6:00 AM - 10:00 PM</td>
              </tr>
              <tr>
                <td>Sábados</td>
                <td>8:00 AM - 8:00 PM</td>
              </tr>
              <tr>
                <td>Domingos y Festivos</td>
                <td>9:00 AM - 2:00 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="promo-text">
          ¿Listo para empezar tu transformación? ¡Únete a nuestra comunidad y da el primer paso!
        </p>
        <button 
          className="btn-neon"
          onClick={() => navigate('/')}
        >
          Volver
        </button>
      </div>
    </div>
  )
}

export default Info
