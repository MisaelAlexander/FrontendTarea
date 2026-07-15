import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import api from '../services/api';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const productId = product?._id || product?.id;

  useEffect(() => {
    if (isOpen && productId) {
      setLoadingComments(true);
      api.getCommentsByProduct(productId)
        .then(setComments)
        .catch(err => console.error('Error loading comments:', err))
        .finally(() => setLoadingComments(false));
    }
  }, [isOpen, productId]);

  if (!isOpen || !product) return null;

  const name = product.nombre || product.title || 'Producto';
  const price = product.precio || product.price || 0;
  const description = product.descripcion || product.description || '';
  const stock = product.stock || 0;
  const image = product.imagenesProductos?.[0]?.imagen || product.image || '';
  const colors = product.colores || product.colors || [];

  const handleQuantity = (change) => {
    setQuantity(Math.max(1, Math.min(stock, quantity + change)));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.warning('Debes iniciar sesión para agregar al carrito');
      return;
    }
    addToCart(product, quantity);
    onClose();
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user?.id) return;
    setSubmitting(true);
    try {
      await api.createComment(
        'Comentario',
        newComment,
        newRating,
        user.id,
        productId
      );
      setNewComment('');
      setNewRating(5);
      const updatedComments = await api.getCommentsByProduct(productId);
      setComments(updatedComments);
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
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
              <img src={image} alt={name} className="w-full max-w-[220px] h-auto object-contain mix-blend-multiply drop-shadow-md" />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full">
                <ChevronRight className="w-8 h-8 text-black" strokeWidth={2.5} />
              </button>
              <div className="flex gap-2 mt-8 absolute bottom-6">
                <div className="w-3.5 h-3.5 rounded-full bg-gray-400"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-transparent border border-gray-400"></div>
              </div>
            </div>
            <div className="bg-white rounded-[24px] p-6 md:p-8 relative flex flex-col">
              <span className="absolute top-6 right-6 text-xs text-gray-500 font-bold">Stock: {stock}</span>
              <h2 className="text-[26px] font-extrabold text-black leading-tight mb-3 pr-16">{name}</h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[28px] font-extrabold text-black">${Number(price).toFixed(2)}</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-[18px] h-[18px] fill-transparent stroke-gray-800" strokeWidth={2} />)}
                </div>
              </div>
              <p className="text-[13px] text-gray-700 leading-relaxed mb-6">{description}</p>
              <div className="flex gap-10 mb-8 mt-auto">
                <div>
                  <span className="block text-[11px] font-extrabold text-black mb-2">Cantidad</span>
                  <div className="flex items-center border border-gray-300 rounded-full px-2 py-1 bg-white">
                    <button onClick={() => handleQuantity(-1)} className="p-1"><Minus className="w-4 h-4 text-black" /></button>
                    <span className="w-8 text-center text-[13px] font-bold">{quantity}</span>
                    <button onClick={() => handleQuantity(1)} className="p-1"><Plus className="w-4 h-4 text-black" /></button>
                  </div>
                </div>
                {colors.length > 0 && (
                  <div>
                    <span className="block text-[11px] font-extrabold text-black mb-2">Colores</span>
                    <div className="flex gap-2 items-center h-8">
                      {colors.map((color, idx) => (
                        <button key={idx} onClick={() => setSelectedColor(idx)} className={`w-[22px] h-[22px] rounded-full shadow-sm border-2 ${selectedColor === idx ? 'border-gray-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleAddToCart} className="w-full bg-[#1b4b8a] hover:bg-[#153a6b] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md">
                <ShoppingCart className="w-5 h-5" /> Anadir al Carrito
              </button>
            </div>
          </div>

          {/* Seccion de resenas */}
          <div className="bg-white rounded-[24px] p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-black mb-6">Resenas</h3>

            {loadingComments ? (
              <p className="text-sm text-gray-500">Cargando resenas...</p>
            ) : comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment._id} className="bg-[#f8f9fc] rounded-2xl p-5 border border-gray-100 mb-4">
                  <h4 className="font-bold text-[13px]">{comment.IDCliente?.nombre || 'Usuario'}</h4>
                  <div className="flex gap-[2px] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < (comment.Resenia || 0) ? 'stroke-gray-800 fill-gray-800' : 'stroke-gray-300'}`} strokeWidth={1.5} />
                    ))}
                  </div>
                  <p className="text-[12px] text-gray-600">{comment.CuerpoComentario}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aun no hay resenas.</p>
            )}

            {user ? (
              <div className="flex flex-col gap-3 mt-8">
                <div className="flex gap-1 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <button key={i} onClick={() => setNewRating(i + 1)}>
                      <Star className={`w-5 h-5 ${i < newRating ? 'fill-yellow-400 stroke-yellow-400' : 'fill-transparent stroke-gray-800'} cursor-pointer`} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
                <div className="flex w-full border border-gray-300 rounded-xl overflow-hidden">
                  <input
                    type="text"
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-4 py-3 text-sm focus:outline-none"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={submitting || !newComment.trim()}
                    className="bg-[#1b4b8a] hover:bg-[#153a6b] disabled:bg-gray-400 text-white font-bold px-8 py-3 text-[13px]"
                  >
                    {submitting ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-4">Inicia sesion para dejar un comentario.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;