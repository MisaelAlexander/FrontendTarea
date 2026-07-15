import React from 'react';
import CartSidebar from '../components/cardSidebar.jsx';
import CheckoutModal from '../components/checkoutModal.jsx';
import OrderCard from '../components/orderCard.jsx';
import OrderDetailsModal from '../components/orderdetailsModal.jsx';
import { usePedidos } from '../hooks/usePedidos';
import { Package } from 'lucide-react';

/**
 * Página de Pedidos.
 * Muestra el historial de pedidos realizados por el usuario.
 */
const MisPedidos = () => {
  // Obtiene toda la lógica del hook personalizado
  const {
    pedidos,                 // Lista de pedidos del usuario
    loading,                 // Estado de carga
    selectedOrder,           // Pedido seleccionado para ver detalles
    setSelectedOrder,        // Función para seleccionar pedido
    isCheckoutOpen,          // Estado del modal de checkout
    setIsCheckoutOpen,       // Función para abrir/cerrar checkout
    formatDate,              // Función para formatear fechas
  } = usePedidos();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 flex flex-col">
      {/* Sidebar del carrito */}
      <CartSidebar onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Modal de checkout */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Modal de detalles del pedido */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* Contenido principal */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-extrabold text-black mb-6">Mis Pedidos</h2>

        {/* Estados de carga, vacío y resultados */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Cargando pedidos...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <Package className="w-16 h-16 mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="text-lg font-medium">No tienes pedidos aun.</p>
            <p className="text-sm mt-2">Realiza tu primer pedido para verlo aqui.</p>
          </div>
        ) : (
          /* Lista de pedidos */
          <div className="space-y-4">
            {pedidos.map(pedido => (
              <OrderCard
                key={pedido._id}
                order={{
                  id: pedido._id,
                  numeroPedido: pedido.numeroPedido,
                  date: formatDate(pedido.createdAt),
                  type: pedido.tipoPago || 'No especificado',
                  status: 'Completado',
                  total: pedido.idCarrito?.total || 0,
                  details: {
                    tipoPedido: 'Online',
                    tipoPago: pedido.tipoPago || 'No especificado',
                    productos: pedido.idCarrito?.Productos || [],
                    descuento: pedido.idCarrito?.Descuento || 0,
                    total: pedido.idCarrito?.total || 0,
                    totalConDescuento: pedido.idCarrito?.totalConDescuento || 0,
                    comprador: 'Cliente',
                    sucursal: 'Principal',
                    fecha: formatDate(pedido.createdAt),
                  },
                }}
                onViewDetails={setSelectedOrder}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MisPedidos;
