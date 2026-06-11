import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => (
  <div className="relative w-full max-w-5xl mx-auto mt-6 mb-12 px-4">
    <p className="text-[11px] text-gray-400 mb-2 ml-4">Algunas ofertas que te pueden interesar.</p>
    
    {/* Contenedor Principal del Banner */}
    <div className="bg-[#8ab8ed] border-[3px] border-[#69a5e5] rounded-[30px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm h-auto md:h-[300px]">
      
      {/* Formas decorativas de fondo (Círculos difuminados) */}
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#7baae2] rounded-full mix-blend-multiply opacity-40 pointer-events-none"></div>
      <div className="absolute right-10 -top-20 w-96 h-96 bg-[#a1c6f1] rounded-full mix-blend-screen opacity-50 pointer-events-none"></div>
      <div className="absolute left-1/3 -top-10 w-40 h-40 bg-[#7baae2] rounded-full mix-blend-multiply opacity-20 pointer-events-none"></div>

      {/* Flecha Izquierda */}
      <button className="absolute left-3 bg-[#d1d5db] hover:bg-gray-300 p-2.5 rounded-full transition-colors z-20 shadow-md">
        <ChevronLeft className="h-7 w-7 text-black" strokeWidth={2.5} />
      </button>

      {/* Contenido del Banner (Texto) */}
      <div className="text-center md:text-left z-10 px-14 md:pl-16 flex flex-col justify-center w-full md:w-[60%]">
        <h2 className="text-[28px] md:text-[38px] leading-[1.15] font-semibold italic text-black mb-3">
          Procesador INTEL<br/>I9 14900K
        </h2>
        <p className="text-gray-800 text-[13px] md:text-[15px] mb-6 max-w-[380px] leading-snug">
          Disfrute de una mayor potencia con lo ultimo de tecnologia de INTEL, con sus 24 nucleos y 32 hilos.
        </p>
        
        {/* Sección de Precios */}
        <div className="flex items-end justify-center md:justify-start gap-2 mt-2">
          <span className="text-[40px] font-black text-black leading-[0.8]">$710.00</span>
          
          <div className="relative flex flex-col justify-end pb-1 ml-1">
            <span className="text-[11px] font-bold text-gray-500 line-through decoration-gray-500 decoration-2 leading-none">
              $781.00
            </span>
            <span className="absolute -top-3 -right-6 text-[8px] font-black text-white bg-[#ef4444] px-1.5 py-0.5 rounded-full leading-none">
              -10%
            </span>
          </div>
        </div>
      </div>

      {/* Imagen del Banner */}
      <div className="w-full md:w-[40%] flex justify-center mt-8 md:mt-0 z-10 px-12 md:px-0 relative">
        <img 
          src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400" 
          alt="" 
          className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-xl drop-shadow-2xl mix-blend-multiply border border-blue-200/30"
        />
      </div>

      {/* Flecha Derecha */}
      <button className="absolute right-3 bg-[#d1d5db] hover:bg-gray-300 p-2.5 rounded-full transition-colors z-20 shadow-md">
        <ChevronRight className="h-7 w-7 text-black" strokeWidth={2.5} />
      </button>
    </div>
  </div>
);

export default Carousel;