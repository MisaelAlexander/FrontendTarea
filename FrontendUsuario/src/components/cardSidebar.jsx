import { ShoppingBag, X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ onOpenCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    total,
    totalItems,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeCart}
      />
      <div className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-gray-800" strokeWidth={2} />
            <h2 className="text-[16px] font-bold text-black">Mi carrito</h2>
            {totalItems > 0 && (
              <span className="bg-[#4782c5] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-1 text-gray-400 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-40" />
              <p className="text-sm font-medium">Tu carrito esta vacio</p>
              <p className="text-xs text-gray-400 mt-1">Agrega productos para comenzar</p>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const price = Number(item.price) || 0;
              const descuento = Number(item.descuento) || 0;
              const subtotal = price * item.quantity;
              const discount = descuento > 0 ? subtotal * (descuento / 100) : 0;
              const finalPrice = subtotal - discount;
              const itemKey = item.id || `item-${index}`;

              return (
                <div key={itemKey} className="bg-white rounded-xl p-3 flex gap-3 border border-gray-100 shadow-sm">
                  {/* Product Image */}
                  <div className="bg-gray-100 rounded-lg p-2 w-20 h-20 flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full items-center justify-center text-gray-300 ${item.image ? 'hidden' : 'flex'}`}>
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-[12px] font-bold text-gray-900 line-clamp-2 leading-tight">{item.title}</h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-1">
                      {descuento > 0 ? (
                        <>
                          <span className="text-[11px] font-bold text-[#4782c5]">${finalPrice.toFixed(2)}</span>
                          <span className="text-[10px] text-gray-400 line-through">${subtotal.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-[11px] font-bold text-gray-900">${price.toFixed(2)}</span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3 text-gray-600" strokeWidth={2.5} />
                        </button>
                        <span className="text-[11px] font-bold px-3 min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                          disabled={item.stock && item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3 text-gray-600" strokeWidth={2.5} />
                        </button>
                      </div>
                      <span className="text-[12px] font-bold text-gray-900">${finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[14px] font-bold text-gray-800">Total:</span>
              <span className="text-[18px] font-extrabold text-[#1b4b8a]">${(Number(total) || 0).toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                closeCart();
                onOpenCheckout?.();
              }}
              className="w-full bg-[#1b4b8a] hover:bg-[#153a6b] text-white py-3.5 rounded-xl flex justify-center items-center gap-2 text-[13px] font-bold transition-colors shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              Realizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;