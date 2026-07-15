import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Bitcoin, Landmark, Check, ArrowLeft, Store, Truck } from 'lucide-react';
import { usePagos } from '../hooks/usePagos';

/**
 * Página de Pagos.
 * Muestra métodos de pago y resumen del pedido antes de confirmar.
 */
const Pagos = () => {
  // Navegador para botón de volver
  const navigate = useNavigate();

  // Obtiene toda la lógica del hook personalizado
  const {
    cartItems,               // Items del carrito
    total,                   // Total a pagar
    subtotal,                // Subtotal sin descuentos
    descuento,               // Descuento total aplicado
    paymentMethod,           // Método de pago seleccionado
    setPaymentMethod,        // Función para cambiar método de pago
    isPlazos,                // Si es pago a plazos
    setIsPlazos,             // Función para toggle plazos
    loading,                 // Estado de procesamiento
    orderData,               // Datos del pedido (entrega, dirección)
    handlePayment,           // Función para procesar el pago
  } = usePagos();

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header con botón de volver */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Volver</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Metodo de Pago</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Métodos de pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tarjeta de datos de entrega (si existe) */}
            {orderData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Datos de entrega</h2>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-[#2596be] text-white">
                    {orderData.deliveryMethod === 'store' ? <Store className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {orderData.deliveryMethod === 'store' ? 'Retiro en tienda' : 'Envio a domicilio'}
                    </p>
                    {orderData.deliveryMethod === 'store' ? (
                      <p className="text-sm text-gray-500">{orderData.sucursal}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500">{orderData.direccion}</p>
                        {orderData.telefono && <p className="text-sm text-gray-500">Tel: {orderData.telefono}</p>}
                        {orderData.notas && <p className="text-sm text-gray-400 mt-1">Nota: {orderData.notas}</p>}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Selección de método de pago */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Selecciona como deseas pagar</h2>

              <div className="space-y-4">
                {/* Tarjeta de crédito/débito */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-[#2596be] bg-blue-50/40' : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-[#2596be]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-[#2596be] rounded-full" />}
                    </div>
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#2596be]' : 'text-gray-500'}`} />
                    <span className={`font-semibold ${paymentMethod === 'card' ? 'text-[#2596be]' : 'text-gray-700'}`}>
                      Tarjeta de Credito / Debito
                    </span>
                  </div>

                  {/* Formulario de tarjeta (solo visible si está seleccionada) */}
                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-4 animate-in fade-in">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numero de Tarjeta</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha (MM/AA)</label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            maxLength={5}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
                          />
                        </div>
                      </div>
                      {/* Checkbox de pago a plazos */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="pagoPlazos"
                          checked={isPlazos}
                          onChange={e => setIsPlazos(e.target.checked)}
                          className="w-4 h-4 rounded text-[#2596be] border-gray-300"
                        />
                        <label htmlFor="pagoPlazos" className="text-sm font-medium text-gray-700">Pagar a plazos</label>
                      </div>
                      {/* Select de cuotas (solo si está activado) */}
                      {isPlazos && (
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2596be]">
                          <option>3 Cuotas sin intereses</option>
                          <option>6 Cuotas sin intereses</option>
                          <option>9 Cuotas sin intereses</option>
                          <option>12 Cuotas sin intereses</option>
                        </select>
                      )}
                    </div>
                  )}
                </div>

                {/* Efectivo */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'cash' ? 'border-[#2596be] bg-blue-50/40' : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cash' ? 'border-[#2596be]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-[#2596be] rounded-full" />}
                    </div>
                    <Banknote className={`w-5 h-5 ${paymentMethod === 'cash' ? 'text-[#2596be]' : 'text-gray-500'}`} />
                    <span className={`font-semibold ${paymentMethod === 'cash' ? 'text-[#2596be]' : 'text-gray-700'}`}>
                      Efectivo (En tienda)
                    </span>
                  </div>
                </div>

                {/* Bitcoin */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'crypto' ? 'border-[#2596be] bg-blue-50/40' : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'crypto' ? 'border-[#2596be]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'crypto' && <div className="w-2.5 h-2.5 bg-[#2596be] rounded-full" />}
                    </div>
                    <Bitcoin className={`w-5 h-5 ${paymentMethod === 'crypto' ? 'text-[#2596be]' : 'text-gray-500'}`} />
                    <span className={`font-semibold ${paymentMethod === 'crypto' ? 'text-[#2596be]' : 'text-gray-700'}`}>
                      Bitcoin
                    </span>
                  </div>
                </div>

                {/* Transferencia bancaria */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'transfer' ? 'border-[#2596be] bg-blue-50/40' : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => setPaymentMethod('transfer')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'transfer' ? 'border-[#2596be]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 bg-[#2596be] rounded-full" />}
                    </div>
                    <Landmark className={`w-5 h-5 ${paymentMethod === 'transfer' ? 'text-[#2596be]' : 'text-gray-500'}`} />
                    <span className={`font-semibold ${paymentMethod === 'transfer' ? 'text-[#2596be]' : 'text-gray-700'}`}>
                      Transferencia Bancaria
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen del pedido</h3>

              {/* Lista de items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={item.id || index} className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img src={item.image || ''} alt="" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(Number(subtotal) || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Descuento</span>
                  <span className="font-medium text-green-600">-${descuento.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${(Number(total) || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Botón de confirmar pago */}
              <button
                disabled={loading || cartItems.length === 0}
                onClick={handlePayment}
                className="w-full bg-[#2596be] hover:bg-[#1e7a9b] disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors mt-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Procesando...'
                ) : (
                  <>
                    <Check className="h-5 h-5" />
                    Confirmar Pago
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Al confirmar aceptas nuestras politicas de privacidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagos;
