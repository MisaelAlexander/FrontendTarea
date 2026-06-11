import React from 'react';

const OrderCard = ({ order, onViewDetails }) => {
  return (
    <div className="bg-white rounded-[20px] border border-gray-300 shadow-[0_2px_15px_rgb(0,0,0,0.04)] p-6 md:p-8 mb-6 w-full">
      <h3 className="text-xl font-extrabold text-black mb-6">Pedido # {order.id}</h3>

      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-8 md:gap-x-12 flex-grow mb-6 md:mb-0 w-full">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-col">
              <span className="text-[13px] font-extrabold text-black">Fecha de Pedido</span>
              <span className="text-[13px] text-gray-700 mt-0.5">{order.date}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-extrabold text-black">Tipo de Retiro</span>
              <span className="text-[13px] text-gray-700 mt-0.5">{order.type}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-extrabold text-black">Estado</span>
            <span className="text-[13px] text-gray-700 mt-0.5">{order.status}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-extrabold text-black">Monto Total</span>
            <span className="text-[13px] text-gray-700 mt-0.5">$ {order.total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={() => onViewDetails(order)}
          className="bg-[#568dc6] hover:bg-[#386ba5] text-white text-[12px] font-bold py-3.5 px-6 rounded-lg transition-colors w-full md:w-auto md:ml-8"
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default OrderCard;