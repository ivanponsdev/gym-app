import { useEffect } from 'react'

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div id="notification-container">
      <div className={`notification ${type}`}>
        {message}
      </div>
    </div>
  )
}

export default Notification
