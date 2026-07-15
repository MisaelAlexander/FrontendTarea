import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from '../components/card';
import CartSidebar from '../components/cardSidebar';
import CheckoutModal from '../components/checkoutModal';
import ProductDetailsModal from '../components/productdetailsModal';
import { useCart } from '../context/CartContext';
import { useCategoryPage } from '../hooks/useCategoryPage';

/**
 * Página de Categoría.
 * Muestra productos filtrados por categoría con búsqueda en tiempo real.
 */
const CategoryPage = () => {
  // Navegador para botón de volver
  const navigate = useNavigate();
  // Función y datos del carrito del contexto
  const { addToCart, cartItems } = useCart();

  // Obtiene toda la lógica del hook personalizado
  const {
    categoryName,            // Nombre de la categoría de la URL
    filteredProducts,        // Productos filtrados por categoría y búsqueda
    favoriteIds,             // IDs de favoritos locales
    loading,                 // Estado de carga
    selectedProduct,         // Producto seleccionado para modal
    setSelectedProduct,      // Función para seleccionar producto
    isCheckoutOpen,          // Estado del modal de checkout
    setIsCheckoutOpen,       // Función para abrir/cerrar checkout
    toggleFavorite,          // Función de favoritos local
  } = useCategoryPage();

  return (
    <>
      {/* Sidebar del carrito */}
      <CartSidebar onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Modal de checkout */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cartItems} />

      {/* Modal de detalles del producto */}
      <ProductDetailsModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botón de volver */}
        <button onClick={() => navigate('/dashboard')} className="mb-6 text-[#2596be] hover:underline flex items-center gap-1">
          ← Volver al inicio
        </button>

        {/* Título de la categoría */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 capitalize">{categoryName}</h1>

        {/* Estados de carga, vacío y resultados */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No hay productos en esta categoría que coincidan con tu búsqueda.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 text-[#2596be] hover:underline">
              Explorar otros productos
            </button>
          </div>
        ) : (
          /* Grid de productos de la categoría */
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
