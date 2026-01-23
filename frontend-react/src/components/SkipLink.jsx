import React from "react";
import { useAccessibility } from "../context/AccessibilityContext";

const SkipLink = () => {
  const { isAccessible } = useAccessibility();

  if (!isAccessible) return null;

  return (
    <a
      href="#main-content"
      style={{
        position: "absolute",
        top: "-40px",
        left: 0,
        background: "#000",
        color: "#fff",
        padding: "8px 16px",
        textDecoration: "none",
        zIndex: 10000,
        fontSize: "1rem"
      }}
      onFocus={(e) => {
        e.target.style.top = "0";
      }}
      onBlur={(e) => {
        e.target.style.top = "-40px";
      }}
    >
      Saltar al contenido principal
    </a>
  );
};

export default SkipLink;
