// components/ContactMap.jsx
import React from 'react';

const ContactMap = () => (
  <div className="flex-1 w-full bg-[#e3eaf7] rounded-2xl overflow-hidden shadow-sm flex flex-col border border-gray-200">
    <div className="w-full h-[280px] md:h-[320px] bg-gray-300 relative">
      <iframe
        title="Mapa Instituto Técnico Ricaldone"
        src="https://maps.google.com/maps?q=Instituto%20Tecnico%20Ricaldone,%20San%20Salvador,%20El%20Salvador&t=&z=16&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0"
      ></iframe>
    </div>
    <div className="p-6">
      <p className="text-sm text-gray-800 font-medium leading-relaxed">
        Estamos ubicados en el Instituto Técnico Ricaldone, San Salvador. ¡Te esperamos para brindarte la mejor atención!
      </p>
    </div>
  </div>
);

export default ContactMap;