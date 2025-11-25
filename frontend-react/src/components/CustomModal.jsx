import { useEffect } from 'react'

export default function CustomModal({ type = 'alert', message, onConfirm, onCancel, isOpen }) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onCancel()
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const isConfirm = type === 'confirm'
  const isError = message.toLowerCase().includes('error')
  const isDelete = message.toLowerCase().includes('eliminar') || message.toLowerCase().includes('desinscribirte')
  const isWarning = message.toLowerCase().includes('ya estás inscrito') || message.toLowerCase().includes('ya estas inscrito')

  // Determinar icono y clase
  let iconClass = 'success'
  let icon = '✓'
  
  if (isError) {
    iconClass = 'error'
    icon = '⚠'
  } else if (isWarning) {
    iconClass = 'error'
    icon = '⚠'
  } else if (isDelete || (isConfirm && !isError)) {
    iconClass = 'warning'
    icon = '✕'
  }

  return (
    <div className="custom-modal-overlay" onClick={onCancel}>
      <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`custom-modal-icon ${iconClass}`}>
          {icon}
        </div>
        <p className="custom-modal-message">{message}</p>
        <div className="custom-modal-buttons">
          {isConfirm ? (
            <>
              <button className="btn-modal-cancel" onClick={onCancel}>
                Cancelar
              </button>
              <button className="btn-modal-confirm" onClick={onConfirm}>
                Confirmar
              </button>
            </>
          ) : (
            <button className="btn-modal-ok" onClick={onCancel}>
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
