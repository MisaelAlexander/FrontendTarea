import React from 'react';

// Componente Botón
// Se actualizan los estilos base y las variantes para coincidir con el diseño de la imagen
export default function Button({ children, variant = "primary", className = "", ...elements }) {
  // Estilos base para el botón:
  // - py-3 y px-8 para darle más altura y espacio interno
  // - rounded-2xl para los bordes bien redondeados de la imagen
  // - font-bold y text-lg para resaltar el texto
  const baseStyles = "px-8 py-3 rounded-2xl font-bold text-lg transition-colors flex justify-center items-center";
  
  // Variantes de estilos para el botón
  const variants = {
    // Estilo para botón primario 
    primary: "bg-[#165892] text-white hover:bg-[#114573] active:bg-[#0d3457]",
    // Estilo para botón secundario
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    // Estilo para botón de contorno
    outline: "border-2 border-[#165892] text-[#165892] hover:bg-[#bad4f8]/30",
  };

  // Combina los estilos base con la variante seleccionada y cualquier clase adicional
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...elements}
    >
      {/* Contenido del botón */}
      {/*Esto S */}
      {children}
    </button>
  );
}
