import { useState, useEffect } from 'react';
import Modal from './Modal';
import OrderDetailModal from './OrderDetailModal';
import { getPedidos } from '../hooks/pedidosApi';

/**
 * Tabla de pedidos para el Dashboard del admin.
 * Muestra lista de pedidos con búsqueda y modal de detalles.
 */
const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Obtiene pedidos de la API y los transforma para la tabla.
   * Maneja múltiples estructuras de datos posibles del backend.
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const pedidos = await getPedidos();

      if (!Array.isArray(pedidos)) {
        console.error('La respuesta del backend no es un array:', pedidos);
        setError('Formato de respuesta inesperado del servidor');
        return;
      }

      const transformed = pedidos.map(pedido => {
        const carrito = pedido.idCarrito && typeof pedido.idCarrito === 'object'
          ? pedido.idCarrito
          : (pedido.carrito && typeof pedido.carrito === 'object' ? pedido.carrito : {});

        const cliente = carrito.IDCliente && typeof carrito.IDCliente === 'object'
          ? carrito.IDCliente
          : (carrito.Cliente && typeof carrito.Cliente === 'object' ? carrito.Cliente : {});

        const productos = Array.isArray(carrito.Productos)
          ? carrito.Productos
          : (Array.isArray(carrito.productos) ? carrito.productos : []);

        const fecha = pedido.createdAt
          ? new Date(pedido.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'Sin fecha';

        const items = productos.map(p => {
          const productoRaw = p.IDProducto || p.idProducto || p.producto || p;
          const producto = (productoRaw && typeof productoRaw === 'object' && productoRaw._id)
            ? productoRaw
            : {};
          const cantidad = p.amount || p.monto || p.cantidad || p.quantity || 1;
          const precioUnitario = producto.precio || producto.price || 0;
          const subtotalBackend = p.subtotal || 0;

          const monto = precioUnitario > 0
            ? precioUnitario * cantidad
            : (subtotalBackend > 0 ? subtotalBackend : 0);

          return {
            nombre: producto.nombre || producto.name || 'Producto',
            cantidad,
            monto,
            precioUnitario
          };
        });

        const nombresProductos = items
          .map(i => `${i.nombre} x${i.cantidad}`)
          .join(', ') || 'Sin productos';

        const totalCarrito = carrito.totalConDescuento || carrito.total || 0;
        const totalCalculado = items.reduce((sum, item) => sum + item.monto, 0);
        const total = totalCarrito > 0 ? totalCarrito : totalCalculado;

        return {
          id: pedido._id,
          numeroPedido: pedido.numeroPedido || '-',
          cliente: cliente.nombre || 'Sin cliente',
          productos: nombresProductos,
          total,
          tipoPago: pedido.tipoPago || 'No especificado',
          estado: pedido.estado || 'Completado',
          fecha,
          tipoPedido: pedido.tipoPedido || 'Online',
          items,
          descuento: carrito.Descuento || carrito.descuento || 0,
          comprador: cliente.nombre || 'Sin cliente',
          tipoRetiro: pedido.tipoRetiro || 'Tienda',
          raw: pedido
        };
      });

      setOrders(transformed);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error al cargar pedidos: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
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

  // Estado de carga
  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Pedidos</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Pedidos</h2>
        <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl">
          <p>{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Pedidos</h2>

      {/* Barra de búsqueda */}
      <div className="mb-6 w-full sm:w-[400px]">
        <input
          type="text"
          placeholder="Buscar Pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-[3px] border-[#3eb3ff] rounded-xl py-2 px-5 outline-none focus:ring-2 focus:ring-blue-300 text-sm bg-white"
        />
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#a8cbe3] text-black">
            <tr>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold"># Pedido</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Cliente</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Productos</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Total</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Tipo de Pago</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold">Fecha</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-400">
                  {orders.length === 0 ? 'No hay pedidos registrados' : 'No se encontraron pedidos'}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 sm:py-4 px-3 sm:px-6 font-mono text-xs sm:text-sm">#{order.numeroPedido}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-800 text-xs sm:text-sm">{order.cliente}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-800 text-xs sm:text-sm max-w-[200px] truncate">{order.productos}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm">${Number(order.total).toFixed(2)}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-600 text-xs sm:text-sm capitalize">{order.tipoPago}</td>
                  <td className="py-2 sm:py-4 px-3 sm:px-6 text-gray-500 text-xs sm:text-sm">{order.fecha}</td>
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

      {/* Modal de detalles del pedido */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-5xl">
        <OrderDetailModal order={selectedOrder} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default OrdersTable;
