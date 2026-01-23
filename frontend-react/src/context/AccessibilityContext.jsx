import React, { createContext, useState, useContext, useEffect } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [isAccessible, setIsAccessible] = useState(false);

  // Detección automática de preferencias del SO
  useEffect(() => {
    const match = window.matchMedia("(forced-colors: active), (prefers-contrast: more)");
    if (match.matches) {
      setIsAccessible(true);
    }

    const handleChange = (e) => {
      if (e.matches) {
        setIsAccessible(true);
      }
    };

    match.addEventListener("change", handleChange);
    return () => match.removeEventListener("change", handleChange);
  }, []);

  // Aplicar clase al body
  useEffect(() => {
    document.body.classList.toggle("accesible", isAccessible);
  }, [isAccessible]);

  return (
    <AccessibilityContext.Provider value={{ isAccessible, setIsAccessible }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility debe usarse dentro de AccessibilityProvider");
  }
  return context;
}
