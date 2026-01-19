import { useEffect, useRef, useState } from 'react';

const LandBotWidget = ({ height = '600px', width = '100%' }) => {
  const containerRef = useRef(null);
  const landbotInstance = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup cuando se sale del apartado
  useEffect(() => {
    return () => {
      // Destruir la instancia de Landbot cuando se desmonte el componente
      if (landbotInstance.current) {
        try {
          if (landbotInstance.current.destroy) {
            landbotInstance.current.destroy();
          }
        } catch (error) {
          console.error('Error al destruir Landbot al desmontar:', error);
        }
        landbotInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Solo inicializa automáticamente en modo desktop
    if (isMobile) {
      // Si es móvil elimina la instancia
      if (landbotInstance.current) {
        try {
          if (landbotInstance.current.destroy) {
            landbotInstance.current.destroy();
          }
        } catch (error) {
          console.error('Error al destruir instancia:', error);
        }
        landbotInstance.current = null;
      }
      return;
    }

    let checkInterval = null;

    const initLandbot = () => {
      if (window.Landbot && !landbotInstance.current) {
        try {
          // Modo Container embebido para pantallas grandes
          if (containerRef.current) {
            landbotInstance.current = new window.Landbot.Container({
              container: containerRef.current,
              configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-3263699-RJ2N8WIR1A23XY92/index.json',
            });
          }
        } catch (error) {
          console.error('Error al inicializar Landbot:', error);
        }
      }
    };

    // Si Landbot ya está cargado, inicializar inmediatamente
    if (window.Landbot) {
      initLandbot();
    } else {
      // Esperar a que el script se cargue
      checkInterval = setInterval(() => {
        if (window.Landbot) {
          clearInterval(checkInterval);
          initLandbot();
        }
      }, 100);
    }

    // Cleanup al desmontar o cambiar de modo
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (landbotInstance.current) {
        try {
          if (landbotInstance.current.destroy) {
            landbotInstance.current.destroy();
          }
        } catch (error) {
          console.error('Error al destruir instancia en cleanup:', error);
        }
        landbotInstance.current = null;
      }
    };
  }, [isMobile]);

  const handleOpenChat = () => {
    if (!window.Landbot) {
      console.error('Landbot no está cargado');
      return;
    }

    // Inicializar el chatbot en modo popup solo cuando se hace clic 
    //Esto es lo que he añadido para pantallas móviles
    if (!landbotInstance.current) {
      try {
        landbotInstance.current = new window.Landbot.Livechat({
          configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-3263699-RJ2N8WIR1A23XY92/index.json',
          showCloseButton: true,
          // Posicionar el icono en la esquina superior izquierda
          position: {
            side: 'left',
            verticalOffset: 20,
            horizontalOffset: 20
          }
        });
        // Abrir inmediatamente después de inicializar
        if (landbotInstance.current.open) {
          landbotInstance.current.open();
        }
      } catch (error) {
        console.error('Error al inicializar Landbot Livechat:', error);
      }
    } else if (landbotInstance.current.open) {
      // Si ya existe, solo abrirlo
      landbotInstance.current.open();
    }
  };

  // En modo móvil, mostra boton para abrir el chat
  if (isMobile) {
    return (
      <div 
        style={{ 
          width: width, 
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }} 
      >
        <button
          onClick={handleOpenChat}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1.5rem 3rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          Abrir Asistente Virtual
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: width, 
        height: height,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  );
};

export default LandBotWidget;
