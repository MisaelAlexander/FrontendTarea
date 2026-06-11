import { useState } from 'react';
import {
  X, Store, Truck, CreditCard, Banknote, Bitcoin, Landmark, Check
} from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, cartItems }) => {
  const [deliveryMethod, setDeliveryMethod] = useState('store');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isPlazos, setIsPlazos] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Descuentos = 0

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-6" onClick={onClose}>
      <div className="bg-[#f0f4f8] rounded-2xl w-full max-w-[1050px] max-h-[95vh] overflow-hidden shadow-2xl flex flex-col relative" onClick={e => e.stopPropagation()}>
        {/* Cabecera Azul */}
        <div className="bg-gradient-to-r from-[#4476ce] to-[#3b60aa] p-5 text-white relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-5 right-5 text-white hover:text-gray-200">
            <X size={24} strokeWidth={2.5} />
          </button>
          <h2 className="text-xl font-bold tracking-wide">Finalizar Compra</h2>
        </div>

        {/* Cuerpo del Modal */}
        <div className="flex flex-col md:flex-row overflow-y-auto">
          {/* Columna Izquierda */}
          <div className="w-full md:w-[60%] lg:w-[65%] p-6 md:p-8 flex flex-col gap-8">
            {/* Método de entrega */}
            <div>
              <h3 className="text-[16px] font-extrabold text-black mb-4">¿Cómo deseas obtener tu pedido?</h3>
              <div className="flex flex-col gap-3">
                <div className={`border-2 rounded-xl transition-all overflow-hidden ${deliveryMethod === 'store' ? 'border-[#4ba0e3] bg-blue-50/40' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setDeliveryMethod('store')}>
                    <div className={`p-2 rounded-full ${deliveryMethod === 'store' ? 'bg-[#4ba0e3] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Store className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-[14px] text-gray-800">Retirar en tienda</span>
                    {deliveryMethod === 'store' && <Check className="w-5 h-5 text-[#4ba0e3] ml-auto" strokeWidth={3} />}
                  </div>
                  {deliveryMethod === 'store' && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <label className="block text-[11px] font-bold text-gray-600 mb-1.5">Sucursales Disponibles</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ba0e3] bg-white cursor-pointer">
                          <option>Metrocentro San Salvador</option>
                          <option>Plaza Merliot</option>
                          <option>Galerías Escalón</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`border-2 rounded-xl transition-all overflow-hidden ${deliveryMethod === 'home' ? 'border-[#4ba0e3] bg-blue-50/40' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setDeliveryMethod('home')}>
                    <div className={`p-2 rounded-full ${deliveryMethod === 'home' ? 'bg-[#4ba0e3] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Truck className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-[14px] text-gray-800">Envío a Domicilio</span>
                    {deliveryMethod === 'home' && <Check className="w-5 h-5 text-[#4ba0e3] ml-auto" strokeWidth={3} />}
                  </div>
                  {deliveryMethod === 'home' && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">Dirección de envío completa</label>
                          <textarea rows="2" placeholder="Ej. Calle Los Pinos, Pasaje 3, Casa #45..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">Punto de referencia</label>
                          <input type="text" placeholder="Ej. Frente a la tienda azul, portón negro..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">Departamento</label>
                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer">
                              <option>San Salvador</option>
                              <option>La Libertad</option>
                              <option>Santa Ana</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">Teléfono</label>
                            <input type="tel" placeholder="0000-0000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <h3 className="text-[16px] font-extrabold text-black mb-4">¿Cómo deseas pagar?</h3>
              <div className="flex flex-col gap-3">
                <div className={`border-2 rounded-xl transition-all overflow-hidden ${paymentMethod === 'card' ? 'border-[#4ba0e3] bg-blue-50/40' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setPaymentMethod('card')}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#4ba0e3]' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <div className="w-2 h-2 bg-[#4ba0e3] rounded-full" />}
                    </div>
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#4ba0e3]' : 'text-gray-500'}`} strokeWidth={2} />
                    <span className={`text-[13px] font-bold ${paymentMethod === 'card' ? 'text-[#4ba0e3]' : 'text-gray-700'}`}>Tarjeta de Crédito / Débito</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2">
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">Número de Tarjeta</label>
                          <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">Fecha (MM/AA)</label>
                            <input type="text" placeholder="MM/AA" maxLength={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">CVC</label>
                            <input type="text" placeholder="123" maxLength={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                          </div>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="pt-1">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="pagoPlazos" checked={isPlazos} onChange={e => setIsPlazos(e.target.checked)} className="w-4 h-4 rounded text-[#4ba0e3] border-gray-300 cursor-pointer" />
                            <label htmlFor="pagoPlazos" className="text-[13px] font-bold text-gray-800 cursor-pointer select-none">Deseo pagar a plazos</label>
                          </div>
                          {isPlazos && (
                            <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                              <label className="block text-[11px] font-bold text-gray-600 mb-1">Selecciona la cantidad de cuotas</label>
                              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer">
                                <option>3 Cuotas sin intereses</option>
                                <option>6 Cuotas sin intereses</option>
                                <option>9 Cuotas sin intereses</option>
                                <option>12 Cuotas sin intereses</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

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
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="bg-white rounded-lg p-1 w-12 h-12 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <span className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight">{item.title}</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">Cant: {item.quantity}</span>
                  </div>
                  <div className="font-bold text-[12px] text-black text-right pt-1 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-medium text-gray-600">Subtotal</span>
                <span className="font-bold text-black">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <input type="text" placeholder="Código de descuento" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-[12px]" />
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-[12px] font-bold">Aplicar</button>
              </div>
              <div className="flex justify-between items-center text-[13px] mt-2">
                <span className="font-medium text-gray-600">Descuento</span>
                <span className="font-bold text-green-600">-$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-300 mt-1">
                <span className="font-extrabold text-[16px] text-black">Total</span>
                <span className="font-extrabold text-[18px] text-black">${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="w-full bg-[#1b4b8a] hover:bg-[#153a6b] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md mt-8"
              onClick={() => {
                alert("Pedido confirmado con éxito!");
                onClose();
              }}
            >
              Confirmar pedido
            </button>
            <p className="text-[10px] text-center text-gray-500 mt-4 px-2 leading-relaxed">
              Al confirmar el pedido aceptas nuestras políticas de privacidad y términos del servicio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;