// pages/Contacto.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/cardSidebar';
import ContactHero from '../components/ContactHero';
import ContactForm from '../components/ContactForm';
import ContactMap from '../components/ContactMap';

const Contacto = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans text-gray-900 flex flex-col">

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="flex-grow w-full flex flex-col pb-12">
        <div className="animate-in fade-in duration-500">
          <ContactHero />
          <div className="max-w-6xl mx-auto px-6 md:px-12 mt-12 flex flex-col md:flex-row gap-12 md:gap-20 items-start">
            <ContactForm />
            <ContactMap />
          </div>
        </div>
      </main>

    </div>
  );
};

export default Contacto;