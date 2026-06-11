// components/ContactForm.jsx
import React from 'react';

const ContactForm = () => (
  <div className="flex flex-col flex-1 w-full max-w-md">
    <h2 className="text-lg font-extrabold text-black mb-6">Escribenos tus dudas</h2>
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col">
        <label className="text-sm text-black font-medium mb-1.5" htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          className="w-full border border-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#568dc6] transition-shadow"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-black font-medium mb-1.5" htmlFor="correo">Correo</label>
        <input
          type="email"
          id="correo"
          className="w-full border border-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#568dc6] transition-shadow"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-black font-medium mb-1.5" htmlFor="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          rows={4}
          className="w-full border border-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#568dc6] transition-shadow resize-none"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-[#4880be] hover:bg-[#386ba5] text-white font-bold py-2.5 px-8 rounded-xl transition-colors shadow-sm mt-2 w-32"
      >
        Enviar
      </button>
    </form>
  </div>
);

export default ContactForm;