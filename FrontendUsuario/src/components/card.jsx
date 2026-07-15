import { Heart, Star, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const ProductCard = ({ product, isLiked, onToggleLike, onAddToCart, onViewDetails }) => {
  const { user } = useAuth();
  const toast = useToast();
  const name = product.nombre || product.title || 'Producto';
  const price = Number(product.precio || product.price || 0);
  const descuento = Number(product.descuento || 0);
  const image = product.imagenesProductos?.[0]?.imagen || product.image || '';
  const productId = product._id || product.id;
  const stock = Number(product.stock || 0);

  const discountedPrice = descuento > 0 ? price * (1 - descuento / 100) : price;

  const handleToggleLike = () => {
    if (!user) {
      toast.warning('Debes iniciar sesión para agregar a favoritos');
      return;
    }
    onToggleLike(productId);
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.warning('Debes iniciar sesión para agregar al carrito');
      return;
    }
    onAddToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-[14px] border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col relative pb-5">
      <button
        onClick={handleToggleLike}
        className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-red-500'}`} strokeWidth={1.5} />
      </button>

      {descuento > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Tag className="h-3 w-3" />
          {descuento}% OFF
        </div>
      )}

      <div
        className="h-[170px] w-full bg-[#e1effa] p-4 flex items-center justify-center relative border-b border-gray-200 cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img src={image} alt={name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
      </div>

      <div className="px-4 pt-3 flex flex-col flex-grow bg-white">
        <h3 className="text-[13px] font-bold text-gray-900 line-clamp-2 min-h-[38px] mb-1 leading-tight">{name}</h3>
        <div className="flex text-gray-700 mb-2 gap-[1px]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-transparent stroke-current" strokeWidth={1.5} />
          ))}
        </div>

        {descuento > 0 ? (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#2596be] text-[13px] font-bold">$ {discountedPrice.toFixed(2)}</span>
            <span className="text-gray-400 text-[11px] line-through">$ {price.toFixed(2)}</span>
          </div>
        ) : (
          <p className="text-gray-800 text-[13px] font-medium mb-4">$ {price.toFixed(2)}</p>
        )}

        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-[#4782c5] hover:bg-[#386ba5] text-white text-[12px] font-medium py-2 px-1 rounded-full transition-colors"
          >
            Ver mas
          </button>
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="flex-1 bg-[#84b3e5] hover:bg-[#6c9cce] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[12px] font-medium py-2 px-1 rounded-full transition-colors"
          >
            {stock <= 0 ? 'Agotado' : 'Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
