import { X, Store, Truck, CreditCard, Banknote, Bitcoin, Landmark, Check } from 'lucide-react';
import { useCheckout } from '../hooks/useCheckout';

/**
 * Modal de checkout.
 * Permite seleccionar método de entrega y pago antes de continuar a pagos.
 */
const CheckoutModal = ({ isOpen, onClose }) => {
  const {
    cartItems,
    total,
    subtotal,
    descuento,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    sucursal,
    setSucursal,
    direccion,
    setDireccion,
    telefono,
    setTelefono,
    notas,
    setNotas,
    handleContinue,
  } = useCheckout(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-6" onClick={onClose}>
      <div className="bg-[#f0f4f8] rounded-2xl w-full max-w-[1050px] max-h-[95vh] overflow-hidden shadow-2xl flex flex-col relative" onClick={e => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-[#4476ce] to-[#3b60aa] p-5 text-white relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-5 right-5 text-white hover:text-gray-200">
            <X size={24} strokeWidth={2.5} />
          </button>
          <h2 className="text-xl font-bold tracking-wide">Finalizar Compra</h2>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col md:flex-row overflow-y-auto">
          {/* Columna Izquierda */}
          <div className="w-full md:w-[60%] lg:w-[65%] p-6 md:p-8 flex flex-col gap-8">
            {/* Método de entrega */}
            <div>
              <h3 className="text-[16px] font-extrabold text-black mb-4">Como deseas obtener tu pedido?</h3>
              <div className="flex flex-col gap-3">
                {/* Retirar en tienda */}
                <div
                  className={`border-2 rounded-xl transition-all overflow-hidden cursor-pointer ${
                    deliveryMethod === 'store' ? 'border-[#4ba0e3] bg-blue-50/40' : 'border-gray-200 bg-white hover:border-blue-200'
                  }`}
                  onClick={() => setDeliveryMethod('store')}
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className={`p-2 rounded-full ${deliveryMethod === 'store' ? 'bg-[#4ba0e3] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Store className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-[14px] text-gray-800">Retirar en tienda</span>
                    {deliveryMethod === 'store' && <Check className="w-5 h-5 text-[#4ba0e3] ml-auto" strokeWidth={3} />}
                  </div>
                  {deliveryMethod === 'store' && (
                    <div className="px-4 pb-4">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <label className="block text-[11px] font-bold text-gray-600 mb-1.5">Sucursal</label>
                        <select
                          value={sucursal}
                          onChange={(e) => setSucursal(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ba0e3] bg-white cursor-pointer"
                        >
                          <option>Metrocentro San Salvador</option>
                          <option>Plaza Merliot</option>
                          <option>Galerias Escalon</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Envío a domicilio */}
                <div
                  className={`border-2 rounded-xl transition-all overflow-hidden cursor-pointer ${
                    deliveryMethod === 'home' ? 'border-[#4ba0e3] bg-blue-50/40' : 'border-gray-200 bg-white hover:border-blue-200'
                  }`}
                  onClick={() => setDeliveryMethod('home')}
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className={`p-2 rounded-full ${deliveryMethod === 'home' ? 'bg-[#4ba0e3] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Truck className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-[14px] text-gray-800">Envio a Domicilio</span>
                    {deliveryMethod === 'home' && <Check className="w-5 h-5 text-[#4ba0e3] ml-auto" strokeWidth={3} />}
                  </div>
                  {deliveryMethod === 'home' && (
                    <div className="px-4 pb-4">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">Direccion de envio</label>
                          <textarea
                            rows="2"
                            placeholder="Ej. Calle Los Pinos, Pasaje 3, Casa #45..."
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#4ba0e3]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">Telefono</label>
                          <input
                            type="tel"
                            placeholder="0000-0000"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ba0e3]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">Notas (opcional)</label>
                          <input
                            type="text"
                            placeholder="Instrucciones especiales de entrega..."
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ba0e3]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <h3 className="text-[16px] font-extrabold text-black mb-4">Como deseas pagar?</h3>
              <div className="flex flex-col gap-3">
                {/* Tarjeta */}
                <div
                  className={`border-2 rounded-xl transition-all overflow-hidden cursor-pointer ${
                    paymentMethod === 'card' ? 'border-[#4ba0e3] bg-blue-50/40' : 'border-gray-200 bg-white hover:border-blue-200'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#4ba0e3]' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <div className="w-2 h-2 bg-[#4ba0e3] rounded-full" />}
                    </div>
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#4ba0e3]' : 'text-gray-500'}`} strokeWidth={2} />
                    <span className={`text-[13px] font-bold ${paymentMethod === 'card' ? 'text-[#4ba0e3]' : 'text-gray-700'}`}>Tarjeta de Credito / Debito</span>
                  </div>
                </div>

                {/* Efectivo, Bitcoin, Transferencia */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'cash', label: 'Efectivo (En tienda)', icon: Banknote },
                    { id: 'crypto', label: 'Bitcoin', icon: Bitcoin },
                    { id: 'transfer', label: 'Transferencia', icon: Landmark },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      disabled={method.id === 'cash' && deliveryMethod === 'home'}
                      className={`flex items-center gap-2 p-3.5 border-2 rounded-xl transition-all text-left ${
                        (method.id === 'cash' && deliveryMethod === 'home')
                          ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                          : paymentMethod === method.id
                            ? 'border-[#4ba0e3] bg-blue-50/40 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-blue-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === method.id ? 'border-[#4ba0e3]' : 'border-gray-300'}`}>
                        {paymentMethod === method.id && <div className="w-2 h-2 bg-[#4ba0e3] rounded-full" />}
                      </div>
                      <method.icon className={`w-5 h-5 shrink-0 ${paymentMethod === method.id ? 'text-[#4ba0e3]' : 'text-gray-500'}`} strokeWidth={2} />
                      <span className={`text-[11px] md:text-[12px] font-bold leading-tight ${paymentMethod === method.id ? 'text-[#4ba0e3]' : 'text-gray-700'}`}>
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha (Resumen) */}
          <div className="w-full md:w-[40%] lg:w-[35%] bg-gray-50/80 border-l border-gray-200 p-6 md:p-8 flex flex-col">
            <h3 className="text-[18px] font-extrabold text-black mb-6">Tu pedido</h3>
            <div className="flex-1 overflow-y-auto pr-2 mb-6 space-y-4">
              {cartItems.map((item, index) => {
                const price = Number(item.price) || 0;
                const desc = Number(item.descuento) || 0;
                const finalPrice = desc > 0 ? price * (1 - desc / 100) : price;
                const itemKey = item.id || `item-${index}`;
                return (
                  <div key={itemKey} className="flex gap-3">
                    <div className="bg-white rounded-lg p-1 w-12 h-12 border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <img src={item.image || ''} alt={item.title || ''} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <span className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight">{item.title}</span>
                      <span className="text-[11px] text-gray-500 mt-0.5">Cant: {item.quantity}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[12px] text-black">${(finalPrice * item.quantity).toFixed(2)}</span>
                      {desc > 0 && (
                        <span className="block text-[10px] text-gray-400 line-through">${(price * item.quantity).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen de entrega */}
            <div className="bg-white rounded-lg p-3 mb-4 text-[11px]">
              <p className="font-bold text-gray-700 mb-1">
                {deliveryMethod === 'store' ? 'Retiro en tienda' : 'Envio a domicilio'}
              </p>
              {deliveryMethod === 'store' ? (
                <p className="text-gray-500">{sucursal}</p>
              ) : (
                <p className="text-gray-500 truncate">{direccion || 'Sin direccion'}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-medium text-gray-600">Subtotal</span>
                <span className="font-bold text-black">${(Number(subtotal) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] mt-2">
                <span className="font-medium text-gray-600">Descuento</span>
                <span className="font-bold text-green-600">-${descuento.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-300 mt-1">
                <span className="font-extrabold text-[16px] text-black">Total</span>
                <span className="font-extrabold text-[18px] text-black">${(Number(total) || 0).toFixed(2)}</span>
              </div>
            </div>
            <button
              disabled={cartItems.length === 0}
              onClick={handleContinue}
              className="w-full bg-[#1b4b8a] hover:bg-[#153a6b] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md mt-8"
            >
              Realizar Compra
            </button>
            <p className="text-[10px] text-center text-gray-500 mt-4 px-2 leading-relaxed">
              Al continuar aceptas nuestras politicas de privacidad y terminos del servicio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
