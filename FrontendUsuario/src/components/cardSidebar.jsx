import { ShoppingBag, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ onOpenCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
    
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeCart}
      />
      <div className="fixed top-0 right-0 h-full w-full sm:w-[360px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col translate-x-0">
        {/* Cabecera */}
        <div className="flex items-center px-5 py-4 border-b border-gray-300 bg-white">
          <ShoppingBag className="w-5 h-5 text-gray-800 mr-3" strokeWidth={2} />
          <h2 className="text-[16px] font-bold text-black">Mi carrito</h2>
          <button onClick={closeCart} className="ml-auto text-gray-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">Tu carrito está vacío</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="bg-[#f4f2f0] rounded-[14px] p-3 flex relative border border-gray-100">
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
                <div className="bg-white rounded-lg p-1.5 w-16 h-16 flex items-center justify-center shadow-sm">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="ml-4 flex flex-col justify-center flex-grow pr-4">
                  <h4 className="text-[11px] font-extrabold text-black line-clamp-1">{item.title}</h4>
                  <p className="text-[10px] text-gray-800 font-medium mt-1">$ {item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2 bg-white rounded-full border border-gray-200 w-fit px-1 py-0.5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1">
                      <Minus className="w-3 h-3" strokeWidth={2.5} />
                    </button>
                    <span className="text-[10px] font-bold px-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1">
                      <Plus className="w-3 h-3" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con total */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex justify-between mb-5">
            <span className="text-[13px] font-extrabold">Total:</span>
            <span className="text-[15px] font-extrabold">$ {total.toFixed(2)}</span>
          </div>
          <button
            disabled={cartItems.length === 0}
            onClick={() => {
              closeCart();
              onOpenCheckout?.();
            }}
            className="w-full bg-[#84b3e5] hover:bg-[#6c9cce] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-full flex justify-center items-center gap-2 text-[13px] font-bold"
          >
            <ShoppingCart className="w-4 h-4" />
            Realizar Compra
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;