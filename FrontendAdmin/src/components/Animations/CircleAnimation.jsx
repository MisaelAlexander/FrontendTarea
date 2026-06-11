import React, { useState,useEffect } from "react";

// Componente de animación de círculos
const CircleAnimation = ({ numCircles = 12 }) => {
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    
    // Colores de fondo aleatorios
    const colors = ['#165892', '#2a7faa', '#4a9fc5', '#7bb8d4', '#e0efff'];
    // Generamos círculos con posiciones, tamaños y tiempos de animación aleatorios
    const newCircles = Array.from({ length: numCircles }).map((_, i) => ({
      // Cada círculo tiene un ID, tamaño, posiciones, duración y retraso aleatorios
      id: i,
      // Generamos posiciones aleatorias dentro del contenedor
      size: Math.random() * 200 + 100, // Tamaño entre 50px y 200px
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      // Generamos duraciones y retrasos aleatorios
      animationDuration: `${Math.random() * 6 + 4}s`, // Duración entre 4s y 10s
      animationDelay: '0s', // Retraso de 0s para su inicio(no tocar si no se ve al inicio)
      // Capturamos el color de fondo de manera aleatorio por medio de el uso de la variable "colors"
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    }));
    setCircles(newCircles);
  }, [numCircles]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Estilos CSS inyectados para la animación de aparecer/desaparecer y flotar */}
      <style>{`
      
        @keyframes appearDisappear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1) translateY(-20px);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
        }
        .circle-animated {
          animation-name: appearDisappear;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
      
      {circles.map((circle) => (
        <div
          key={circle.id}
          className="absolute rounded-full circle-animated blur-[2px]"
          style={{
            width: circle.size,
            height: circle.size,
            left: circle.left,
            top: circle.top,
            backgroundColor: circle.backgroundColor,
            animationDuration: circle.animationDuration,
            animationDelay: circle.animationDelay,
          }}
        />
      ))}
    </div>
  );
};
export default CircleAnimation;