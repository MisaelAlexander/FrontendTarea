import { useState, useEffect } from 'react';
import Modal from './Modal';
import OrderDetailModal from './OrderDetailModal';
import { getPedidos } from '../hooks/pedidosApi';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const pedidos = await getPedidos();
      // Transformamos para el formato que espera la tabla
      const transformed = pedidos.map(pedido => ({
        id: pedido._id,
        cliente: pedido.idCarrito?.IDCliente?.nombre || 'Sin cliente',
        productos: pedido.idCarrito?.Productos?.map(p => p.IDProducto?.nombre || 'Producto').join(', ') || 'Sin productos',
        total: pedido.idCarrito?.totalConDescuento || pedido.idCarrito?.total || 0,
        tipoPago: pedido.tipoPago || 'No especificado',
        estado: pedido.estado || 'Pendiente', // puedes agregar este campo al modelo si quieres
        raw: pedido // guardamos el objeto original para el modal
      }));
      setOrders(transformed);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredOrders = orders.filter(o =>
    o.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.productos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Pedidos</h2>
      <div className="mb-6 w-full sm:w-[400px]">
        <input
          type="text"
          placeholder="Buscar Pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-400">
                  No hay pedidos registrados
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-800 text-xs sm:text-sm">{order.cliente}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-800 text-xs sm:text-sm">{order.productos}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm">${Number(order.total).toFixed(2)}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-600 text-xs sm:text-sm">{order.tipoPago}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-600 text-xs sm:text-sm">{order.estado}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 text-center">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="bg-[#5b8cff] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold hover:bg-blue-600"
                    >
                      Ver más
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-5xl">
        <OrderDetailModal order={selectedOrder} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default OrdersTable;