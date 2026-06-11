import React from 'react';
import { X } from 'lucide-react';

// Subcomponente auxiliar
const InfoBox = ({ label, value }) => (
  <div className="border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center bg-white flex-1">
    <span className="font-extrabold text-[13px] text-gray-800 mr-4">{label}</span>
    <span className="text-[13px] text-gray-600 truncate">{value}</span>
  </div>
);

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-[850px] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-[#4476ce] to-[#3b60aa] p-6 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
          <h2 className="text-xl font-bold tracking-wide">Información general del pedido</h2>
        </div>

        {/* Cuerpo */}
        <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
          
          {/* Fila superior */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <InfoBox label="Tipo de pedido" value={order.details.tipoPedido} />
            <InfoBox label="Fecha de Pedido" value={order.date} />
            <InfoBox label="Tipo de pago" value={order.details.tipoPago} />
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tabla de productos */}
            <div className="md:col-span-2 border border-gray-300 rounded-xl p-5 flex flex-col bg-white">
              <div className="flex justify-between border-b border-gray-200 pb-3 mb-4">
                <span className="font-extrabold text-[13px] text-gray-800 flex-1">Productos</span>
                <span className="font-extrabold text-[13px] text-gray-800 w-16 text-center">Cantidad</span>
                <span className="font-extrabold text-[13px] text-gray-800 w-24 text-right">Monto</span>
              </div>
              
              <div className="flex flex-col gap-3">
                {order.details.productos.map((prod, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-[13px] text-gray-700 flex-1 pr-4 truncate">{prod.nombre}</span>
                    <span className="text-[13px] text-gray-700 w-16 text-center">{prod.cantidad}</span>
                    <span className="font-bold text-[13px] text-gray-800 w-24 text-right">$ {prod.monto.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="mt-10 flex flex-col gap-3 self-end w-full md:w-[60%]">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-[13px] text-gray-800">Descuento</span>
                  <span className="text-[13px] text-gray-700">$ {order.details.descuento.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-extrabold text-[13px] text-gray-800">Total</span>
                  <span className="font-bold text-[13px] text-gray-800">$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="flex flex-col gap-4">
              <InfoBox label="Comprador" value={order.details.comprador} />
              <InfoBox label="Estado" value={order.status} />
              <InfoBox label="Tipo de Retiro" value={order.type} />
              <InfoBox label="Sucursal" value={order.details.sucursal} />
            </div>
          </div>

          {/* Botón cerrar */}
          <div className="mt-2">
            <button 
              onClick={onClose} 
              className="border border-[#4476ce] text-[#4476ce] font-medium text-[13px] px-8 py-2.5 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;