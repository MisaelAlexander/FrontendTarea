// pages/MisPedidos.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/cardSidebar.jsx';
import OrderCard from '../components/orderCard.jsx';
import OrderDetailsModal from '../components/orderdetailsModal.jsx';
import pedidosData from '../data/dataOrder.js';

const MisPedidos = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);      // Para el sidebar del carrito
  const [selectedOrder, setSelectedOrder] = useState(null); // Para el modal de detalles


  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 flex flex-col">
      {/* Barra de navegación con control del carrito */}
      

      {/* Sidebar del carrito (aún vacío, pero funcional) */}
      {/* Si ya tienes CartSidebar, impórtalo y úsalo aquí */}
      {/* Por ahora lo dejamos comentado para no romper, pero puedes añadirlo después */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}  />

      {/* Modal de detalles del pedido */}
      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

      {/* Contenido principal */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-extrabold text-black mb-6">Mis Pedidos</h2>
        {pedidosData.map(pedido => (
          <OrderCard 
            key={pedido.id} 
            order={pedido} 
            onViewDetails={setSelectedOrder} 
          />
        ))}
      </main>

    </div>
  );
};

export default MisPedidos;