import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productsData from '../data/dataProduct';
import ProductCard from '../components/card';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext'; // <-- importar
import CartSidebar from '../components/cardSidebar';
import CheckoutModal from '../components/checkoutModal';
import ProductDetailsModal from '../components/productdetailsModal';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { addToCart, cartItems } = useCart();
  const { searchQuery } = useSearch(); // <-- obtener query

  const toggleFavorite = (id) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // Filtro por categoría + búsqueda global
  const filteredProducts = productsData.filter(product => {
    const categoryMatch = product.category?.toLowerCase() === categoryName?.toLowerCase();
    const queryMatch = searchQuery === '' ? true : (
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return categoryMatch && queryMatch;
  });

  return (
    <>
      {/* Sin Navbar aquí */}
      <CartSidebar onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cartItems} />
      <ProductDetailsModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/dashboard')} className="mb-6 text-[#2596be] hover:underline flex items-center gap-1">
          ← Volver al inicio
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8 capitalize">{categoryName}</h1>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No hay productos en esta categoría que coincidan con tu búsqueda.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 text-[#2596be] hover:underline">
              Explorar otros productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isLiked={favoriteIds.includes(product.id)}
                onToggleLike={toggleFavorite}
                onAddToCart={addToCart}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default CategoryPage;