// src/components/OrdersTable.jsx
import { useState } from 'react';
import orders from '../data/sales';
import Modal from './Modal'; // Asegúrate de tener el componente Modal
import OrderDetailModal from './OrderDetailModal';

const OrdersTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openOrderDetails = (order) => {
    // Transforma tu pedido simple al formato que espera el modal
    const enrichedOrder = {
      id: order.id || Math.random(),
      tipoPedido: "En línea",
      fecha: order.fecha || new Date().toISOString().split('T')[0],
      tipoPago: order.type,
      comprador: order.client,
      estado: order.status,
      tipoRetiro: "Tienda",
      descuento: 0,
      total: parseFloat(order.total.replace('$', '')),
      items: [
        {
          nombre: order.product,
          cantidad: 1,
          monto: parseFloat(order.total.replace('$', ''))
        }
      ]
    };
    setSelectedOrder(enrichedOrder);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Pedidos</h2>
      <div className="mb-6 w-full sm:w-[400px]">
        <input 
          type="text" 
          placeholder="Buscar Pedidos..." 
          className="w-full border-[3px] border-[#3eb3ff] rounded-xl py-2 px-5 outline-none focus:ring-2 focus:ring-blue-300 text-sm bg-white"
        />
      </div>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#a8cbe3] text-black">
            <tr>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Cliente</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Productos</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Total</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Tipo de Pago</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Estado</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-800 text-xs sm:text-sm">{order.client}</td>
                <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-800 text-xs sm:text-sm">{order.product}</td>
                <td className="py-2 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm">{order.total}</td>
                <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-600 text-xs sm:text-sm">{order.type}</td>
                <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-600 text-xs sm:text-sm">{order.status}</td>
                <td className="py-2 sm:py-4 px-3 sm:px-6 text-center">
                  <button
                    onClick={() => openOrderDetails(order)}
                    className="bg-[#5b8cff] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold hover:bg-blue-600"
                  >
                    Ver más
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal flotante */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-5xl">
        <OrderDetailModal order={selectedOrder} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default OrdersTable;