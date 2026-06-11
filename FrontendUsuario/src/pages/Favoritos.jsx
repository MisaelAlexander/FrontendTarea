// pages/Favorite.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/card';
import CartSidebar from '../components/cardSidebar';
import Footer from '../components/Footer';
import ProductDetailsModal from '../components/ProductDetailsModal';
import productsData from '../data/dataProduct.js';
import { Heart } from 'lucide-react';
import { CartProvider, useCart } from '../context/CartContext';

const AppContent = () => {
  const [favoriteIds, setFavoriteIds] = useState([1, 4]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  const toggleFavorite = (id) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const favoriteProducts = productsData.filter(p => favoriteIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans text-gray-900 flex flex-col">

      <CartSidebar />

      {/* Modal de detalles del producto */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <main className="flex-grow w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="animate-in fade-in duration-500 mt-10 mb-12 flex-grow">
          <h2 className="text-[22px] font-extrabold text-black mb-6">Mis favoritos</h2>

          {favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-start justify-center py-20 text-gray-400">
              <Heart className="w-16 h-16 mb-4 text-gray-300" strokeWidth={1.5} />
              <p className="text-lg font-medium">Aún no tienes productos favoritos.</p>
              <button className="mt-4 text-[#4782c5] hover:underline font-bold">
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLiked={true}
                  onToggleLike={toggleFavorite}
                  onAddToCart={addToCart}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function Favorite() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}