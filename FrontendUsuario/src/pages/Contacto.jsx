import React, { useState } from 'react';
import ContactHero from '../components/ContactHero';
import ContactForm from '../components/ContactForm';
import ContactMap from '../components/ContactMap';
import CartSidebar from '../components/cardSidebar';
import CheckoutModal from '../components/checkoutModal';

const Contacto = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <CartSidebar onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      <main className="w-full flex flex-col pb-12">
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
