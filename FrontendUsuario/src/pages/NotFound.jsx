// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import CircleAnimation from '../components/Animations/CircleAnimation';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6ea8fe] to-[#3b82f6] overflow-hidden flex flex-col relative font-sans">
      {/* Fondo animado de círculos (solo 12 para suavidad) */}
      <CircleAnimation numCircles={12} />

      {/* Círculos decorativos estáticos (más sutiles) */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-white rounded-full mix-blend-overlay opacity-15 pointer-events-none"></div>

      {/* Contenido principal */}
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 text-center">
        <div className="animate-bounce-slow">
          <h1 
            className="text-[180px] md:text-[260px] font-black text-white leading-none tracking-tighter select-none"
            style={{ textShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
          >
            404
          </h1>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-4 drop-shadow-md">
          ¡Ups! Página no encontrada
        </h2>
        <p className="text-white/80 text-base md:text-lg max-w-md mb-8">
          La página que buscas no existe o fue movida. Revisa la URL o regresa al inicio.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-white text-[#3b82f6] hover:bg-[#f0f4ff] font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Volver al inicio
        </button>
      </main>
    </div>
  );
};

export default NotFound;