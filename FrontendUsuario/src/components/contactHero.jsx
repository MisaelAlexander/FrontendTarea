// components/ContactHero.jsx
import React from 'react';
import CircleAnimation from './Animations/CircleAnimation';

const ContactHero = () => (
  <div className="relative bg-[#8ebaf5] w-full py-16 px-8 md:px-20 overflow-hidden shadow-sm">
    <CircleAnimation numCircles={10} />
    <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-white rounded-full mix-blend-soft-light opacity-30 pointer-events-none"></div>
    <div className="absolute top-[100px] right-[150px] w-[400px] h-[400px] bg-white rounded-full mix-blend-soft-light opacity-20 pointer-events-none"></div>
    <div className="absolute top-[-100px] left-[-50px] w-80 h-80 bg-white rounded-full mix-blend-soft-light opacity-20 pointer-events-none"></div>

    <div className="relative z-10 max-w-lg">
      <h1 className="text-4xl md:text-[42px] font-semibold text-[#304a6e] leading-tight mb-4 tracking-tight">
        ¿Como podemos<br />ayudarte hoy?
      </h1>
      <p className="text-[#3a5882] text-[15px] leading-relaxed">
        Nuestro equipo esta listo para resolver sus dudas e inquietudes, en el menor tiempo posible, ayudandolo a tener una mejor experiencia.
      </p>
    </div>
  </div>
);

export default ContactHero;