// components/ProductDetailsModal.jsx
import React, { useState } from 'react';
import { X, Plus, Minus, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleQuantity = (change) => {
    setQuantity(Math.max(1, Math.min(product.stock, quantity + change)));
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, selectedColorIndex: selectedColor });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-6" onClick={onClose}>
      <div className="bg-[#f0f4f8] rounded-[30px] w-full max-w-[950px] max-h-[95vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Fila superior: imagen e info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] p-6 md:p-10 flex flex-col items-center justify-center relative min-h-[300px]">
              <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full">
                <ChevronLeft className="w-8 h-8 text-black" strokeWidth={2.5} />
              </button>
              <img src={product.image} alt={product.title} className="w-full max-w-[220px] h-auto object-contain mix-blend-multiply drop-shadow-md" />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full">
                <ChevronRight className="w-8 h-8 text-black" strokeWidth={2.5} />
              </button>
              <div className="flex gap-2 mt-8 absolute bottom-6">
                <div className="w-3.5 h-3.5 rounded-full bg-gray-400"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-transparent border border-gray-400"></div>
              </div>
            </div>
            <div className="bg-white rounded-[24px] p-6 md:p-8 relative flex flex-col">
              <span className="absolute top-6 right-6 text-xs text-gray-500 font-bold">Stock: {product.stock}</span>
              <h2 className="text-[26px] font-extrabold text-black leading-tight mb-3 pr-16">{product.title}</h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[28px] font-extrabold text-black">${product.price.toFixed(2)}</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-[18px] h-[18px] fill-transparent stroke-gray-800" strokeWidth={2} />)}
                </div>
              </div>
              <p className="text-[13px] text-gray-700 leading-relaxed mb-6">{product.description}</p>
              <div className="flex gap-10 mb-8 mt-auto">
                <div>
                  <span className="block text-[11px] font-extrabold text-black mb-2">Cantidad</span>
                  <div className="flex items-center border border-gray-300 rounded-full px-2 py-1 bg-white">
                    <button onClick={() => handleQuantity(-1)} className="p-1"><Minus className="w-4 h-4 text-black" /></button>
                    <span className="w-8 text-center text-[13px] font-bold">{quantity}</span>
                    <button onClick={() => handleQuantity(1)} className="p-1"><Plus className="w-4 h-4 text-black" /></button>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] font-extrabold text-black mb-2">Colores</span>
                  <div className="flex gap-2 items-center h-8">
                    {product.colors.map((color, idx) => (
                      <button key={idx} onClick={() => setSelectedColor(idx)} className={`w-[22px] h-[22px] rounded-full shadow-sm border-2 ${selectedColor === idx ? 'border-gray-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleAddToCart} className="w-full bg-[#1b4b8a] hover:bg-[#153a6b] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md">
                <ShoppingCart className="w-5 h-5" /> Añadir al Carrito
              </button>
            </div>
          </div>
          {/* Sección de reseñas (simplificada) */}
          <div className="bg-white rounded-[24px] p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-black mb-6">Reseñas</h3>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map(review => (
                <div key={review.id} className="bg-[#f8f9fc] rounded-2xl p-5 border border-gray-100 mb-4">
                  <h4 className="font-bold text-[13px]">{review.user}</h4>
                  <div className="flex gap-[2px] mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'stroke-gray-800' : 'stroke-gray-300'}`} strokeWidth={1.5} />)}
                  </div>
                  <p className="text-[12px] text-gray-600">{review.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aún no hay reseñas.</p>
            )}
            <div className="flex flex-col md:flex-row items-start gap-4 mt-8">
              <div className="flex gap-1 shrink-0">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-transparent stroke-gray-800 cursor-pointer" strokeWidth={1.5} />)}
              </div>
              <div className="flex w-full border border-gray-300 rounded-xl overflow-hidden">
                <input type="text" placeholder="Escribe un comentario..." className="flex-1 px-4 py-3 text-sm focus:outline-none" />
                <button className="bg-[#1b4b8a] text-white font-bold px-8 py-3 text-[13px]">Enviar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;