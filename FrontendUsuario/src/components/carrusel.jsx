import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '../hooks/useBanners';

/**
 * Componente Carrusel que muestra banners promocionales obtenidos de la API.
 * Permite navegar entre banners usando flechas o indicadores (dots).
 */
const Carousel = () => {
  // Hook personalizado que obtiene banners desde la API
  const { banners, loading } = useBanners();
  // Estado para controlar qué banner está visible actualmente
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Navega al banner anterior.
   * Si está en el primero, vuelve al último (ciclo infinito).
   */
  const handlePrev = () => {
    setCurrentIndex(prev => prev === 0 ? banners.length - 1 : prev - 1);
  };

  /**
   * Navega al siguiente banner.
   * Si está en el último, vuelve al primero (ciclo infinito).
   */
  const handleNext = () => {
    setCurrentIndex(prev => prev === banners.length - 1 ? 0 : prev + 1);
  };

  /**
   * Renderiza el estado de carga mientras se obtienen los banners.
   */
  if (loading) {
    return (
      <div className="relative w-full max-w-5xl mx-auto mt-6 mb-12 px-4">
        <div className="bg-[#8ab8ed] border-[3px] border-[#69a5e5] rounded-[30px] p-6 md:p-10 h-[300px] flex items-center justify-center">
          <p className="text-white text-lg">Cargando banners...</p>
        </div>
      </div>
    );
  }

  // No renderiza nada si no hay banners disponibles
  if (banners.length === 0) {
    return null;
  }

  // Obtiene el banner actual y sus datos del producto asociado
  const banner = banners[currentIndex];
  const product = banner.idProducto;
  const name = product?.nombre || 'Producto';
  const price = product?.precio || 0;
  const description = product?.descripcion || '';
  const image = banner.FotoFondo || '';

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-6 mb-12 px-4">
      {/* Texto indicador sobre las ofertas */}
      <p className="text-[11px] text-gray-400 mb-2 ml-4">Algunas ofertas que te pueden interesar.</p>

      {/* Contenedor principal del banner con fondo azul y bordes redondeados */}
      <div className="bg-[#8ab8ed] border-[3px] border-[#69a5e5] rounded-[30px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm h-auto md:h-[300px]">

        {/* Formas decorativas de fondo (círculos difuminados) */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#7baae2] rounded-full mix-blend-multiply opacity-40 pointer-events-none"></div>
        <div className="absolute right-10 -top-20 w-96 h-96 bg-[#a1c6f1] rounded-full mix-blend-screen opacity-50 pointer-events-none"></div>
        <div className="absolute left-1/3 -top-10 w-40 h-40 bg-[#7baae2] rounded-full mix-blend-multiply opacity-20 pointer-events-none"></div>

        {/* Botón de navegación izquierda */}
        <button
          onClick={handlePrev}
          className="absolute left-3 bg-[#d1d5db] hover:bg-gray-300 p-2.5 rounded-full transition-colors z-20 shadow-md"
        >
          <ChevronLeft className="h-7 w-7 text-black" strokeWidth={2.5} />
        </button>

        {/* Sección de texto: nombre, descripción y precio del producto */}
        <div className="text-center md:text-left z-10 px-14 md:pl-16 flex flex-col justify-center w-full md:w-[60%]">
          <h2 className="text-[28px] md:text-[38px] leading-[1.15] font-semibold italic text-black mb-3">
            {name}
          </h2>
          <p className="text-gray-800 text-[13px] md:text-[15px] mb-6 max-w-[380px] leading-snug">
            {description}
          </p>

          {/* Precio del producto */}
          <div className="flex items-end justify-center md:justify-start gap-2 mt-2">
            <span className="text-[40px] font-black text-black leading-[0.8]">${Number(price).toFixed(2)}</span>
          </div>
        </div>

        {/* Sección de imagen del banner */}
        <div className="w-full md:w-[40%] flex justify-center mt-8 md:mt-0 z-10 px-12 md:px-0 relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-xl drop-shadow-2xl mix-blend-multiply border border-blue-200/30"
            />
          ) : (
            // Placeholder cuando no hay imagen disponible
            <div className="w-48 h-48 md:w-60 md:h-60 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">Sin imagen</span>
            </div>
          )}
        </div>

        {/* Botón de navegación derecha */}
        <button
          onClick={handleNext}
          className="absolute right-3 bg-[#d1d5db] hover:bg-gray-300 p-2.5 rounded-full transition-colors z-20 shadow-md"
        >
          <ChevronRight className="h-7 w-7 text-black" strokeWidth={2.5} />
        </button>
      </div>

      {/* Indicadores (dots) para navegar entre banners - solo se muestran si hay más de 1 */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#2596be]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
