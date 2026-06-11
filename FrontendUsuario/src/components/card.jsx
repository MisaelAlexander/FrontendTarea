import { useState } from 'react';
import { Heart, Star } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-[14px] border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col relative pb-5">
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-red-500'}`} strokeWidth={1.5} />
      </button>

      <div
        className="h-[170px] w-full bg-[#e1effa] p-4 flex items-center justify-center relative border-b border-gray-200 cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
      </div>

      <div className="px-4 pt-3 flex flex-col flex-grow bg-white">
        <h3 className="text-[13px] font-bold text-gray-900 line-clamp-2 min-h-[38px] mb-1 leading-tight">{product.title}</h3>
        <div className="flex text-gray-700 mb-2 gap-[1px]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-transparent stroke-current" strokeWidth={1.5} />
          ))}
        </div>
        <p className="text-gray-800 text-[13px] font-medium mb-4">$ {product.price.toFixed(2)}</p>
        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-[#4782c5] hover:bg-[#386ba5] text-white text-[12px] font-medium py-2 px-1 rounded-full transition-colors"
          >
            Ver más
          </button>
          <button
            onClick={() => onAddToCart(product, 1)}
            className="flex-1 bg-[#84b3e5] hover:bg-[#6c9cce] text-white text-[12px] font-medium py-2 px-1 rounded-full transition-colors"
          >
            Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;