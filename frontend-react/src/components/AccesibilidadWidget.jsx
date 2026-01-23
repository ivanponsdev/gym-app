import React, { useState } from "react";
import { useAccessibility } from "../context/AccessibilityContext";

// SVG de persona esquemática (accesible y simple)
const PersonIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="16" cy="7" r="4" fill="currentColor"/>
    <rect x="13" y="11" width="6" height="10" rx="3" fill="currentColor"/>
    <rect x="8" y="21" width="16" height="3" rx="1.5" fill="currentColor"/>
  </svg>
);

const AccesibilidadWidget = () => {
  const { isAccessible, setIsAccessible } = useAccessibility();
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipText = isAccessible ? "Desactivar modo accesible" : "Activar modo accesible";

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      {/* Tooltip visible */}
      {showTooltip && (
        <div
          className="accessibility-tooltip"
          style={{
            position: "absolute",
            bottom: "60px",
            right: "0",
            background: "#fff",
            color: "#222",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "0.95rem",
            fontWeight: "bold",
            border: "2px solid #222",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            transition: "opacity 0.2s, visibility 0.2s",
            opacity: 1,
            visibility: "visible"
          }}
          role="tooltip"
          aria-hidden="false"
        >
          {tooltipText}
        </div>
      )}

      {/* Botón */}
      <button
        onClick={() => setIsAccessible((v) => !v)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        style={{
          position: "relative",
          background: isAccessible ? "#222" : "#fff",
          color: isAccessible ? "#fff" : "#222",
          borderRadius: "50%",
          width: 48,
          height: 48,
          fontSize: 24,
          border: "2px solid #222",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s"
        }}
        aria-label={tooltipText}
        aria-pressed={isAccessible}
        aria-describedby="accessibility-tooltip"
      >
        <PersonIcon size={28} />
      </button>
    </div>
  );
};

export default AccesibilidadWidget;
