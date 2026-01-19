import { useEffect, useRef } from 'react';

const LandBotWidget = ({ height = '600px', width = '100%' }) => {
  const containerRef = useRef(null);
  const landbotInstance = useRef(null);

  useEffect(() => {
    let checkInterval = null;

    const initLandbot = () => {
      if (window.Landbot && containerRef.current && !landbotInstance.current) {
        try {
          landbotInstance.current = new window.Landbot.Container({
            container: containerRef.current,
            configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-3263699-RJ2N8WIR1A23XY92/index.json',
          });
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

    // Cleanup al desmontar
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      // NO destruir Landbot - causa errores. Simplemente limpiar la referencia
      landbotInstance.current = null;
    };
  }, []);

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
