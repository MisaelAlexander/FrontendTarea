// src/components/OrderDetailModal.jsx
import { X } from 'lucide-react';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="bg-white min-h-[500px]">
      {/* Cabecera con degradado azul */}
      <div className="bg-gradient-to-r from-[#4a69bd] to-[#3c40c6] p-8 pb-10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <X size={28} />
        </button>
        <h2 className="text-white text-3xl font-bold">Información general del pedido</h2>
      </div>

      <div className="p-8 -mt-6 bg-white rounded-t-[3rem] relative z-10 space-y-8">
        {/* Fila Superior: Tipo, Fecha y Pago */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between border-2 border-black rounded-xl px-4 py-3">
            <span className="font-bold text-sm">Tipo de pedido</span>
            <span className="text-gray-600 text-sm">{order.tipoPedido || 'En línea'}</span>
          </div>
          <div className="flex items-center justify-between border-2 border-black rounded-xl px-4 py-3">
            <span className="font-bold text-sm">Fecha de Pedido</span>
            <span className="text-gray-600 text-sm font-mono">{order.fecha}</span>
          </div>
          <div className="flex items-center justify-between border-2 border-black rounded-xl px-4 py-3">
            <span className="font-bold text-sm">Tipo de pago</span>
            <span className="text-gray-600 text-sm">{order.tipoPago}</span>
          </div>
        </div>

        {/* Sección Central: Tabla de Productos y Datos de Entrega */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabla de Productos */}
          <div className="lg:col-span-2 border-2 border-black rounded-2xl p-6 overflow-hidden">
            <div className="grid grid-cols-4 font-bold text-sm border-b-2 border-gray-100 pb-3 mb-4">
              <span className="col-span-2">Productos</span>
              <span className="text-center">Cantidad</span>
              <span className="text-right">Monto</span>
            </div>
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-4 text-sm text-gray-700 items-center">
                    <span className="col-span-2 font-medium">{item.nombre}</span>
                    <span className="text-center font-mono">{item.cantidad}</span>
                    <span className="text-right font-mono">$ {item.monto.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center text-gray-500 py-4">
                  No hay productos registrados
                </div>
              )}
            </div>

            {/* Totales */}
            <div className="mt-8 pt-6 border-t-2 border-gray-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-bold">Descuento</span>
                <span className="font-mono">$ {order.descuento?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg font-black">
                <span>Total</span>
                <span className="font-mono">$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Lateral derecho: Comprador, Estado, Retiro */}
          <div className="space-y-4">
            <div className="border-2 border-black rounded-xl p-4 flex flex-col gap-1">
              <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Comprador</span>
              <span className="font-bold text-sm truncate">{order.comprador}</span>
            </div>
            <div className="border-2 border-black rounded-xl p-4 flex flex-col gap-1">
              <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Estado</span>
              <span className="font-bold text-sm text-green-600">{order.estado}</span>
            </div>
            <div className="border-2 border-black rounded-xl p-4 flex flex-col gap-1">
              <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Tipo de Retiro</span>
              <span className="font-bold text-sm">{order.tipoRetiro || 'Tienda'}</span>
            </div>
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="flex justify-start pt-4">
          <button
            onClick={onClose}
            className="px-10 py-3 border-2 border-blue-200 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;