import React from 'react';
import ProductCard from '../components/card';
import CartSidebar from '../components/cardSidebar';
import CheckoutModal from '../components/checkoutModal';
import ProductDetailsModal from '../components/productdetailsModal';
import { useCart } from '../context/CartContext';
import { useFavoritos } from '../hooks/useFavoritos';
import { Heart } from 'lucide-react';

/**
 * Página de Favoritos.
 * Muestra los productos que el usuario ha marcado como favoritos.
 */
const Favoritos = () => {
  // Función para agregar al carrito del contexto
  const { addToCart } = useCart();

  // Obtiene toda la lógica del hook personalizado
  const {
    filteredProducts,        // Favoritos filtrados por búsqueda
    loading,                 // Estado de carga
    searchQuery,             // Texto de búsqueda actual
    selectedProduct,         // Producto seleccionado para modal
    setSelectedProduct,      // Función para seleccionar producto
    isCheckoutOpen,          // Estado del modal de checkout
    setIsCheckoutOpen,       // Función para abrir/cerrar checkout
    toggleFavorite,          // Función para eliminar de favoritos
  } = useFavoritos();

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans text-gray-900 flex flex-col">
      {/* Sidebar del carrito */}
      <CartSidebar onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Modal de checkout */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Modal de detalles del producto */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Contenido principal */}
      <main className="flex-grow w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="animate-in fade-in duration-500 mt-10 mb-12 flex-grow">
          <h2 className="text-[22px] font-extrabold text-black mb-6">Mis favoritos</h2>

          {/* Estados de carga, vacío y resultados */}
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">Cargando favoritos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-start justify-center py-20 text-gray-400">
              <Heart className="w-16 h-16 mb-4 text-gray-300" strokeWidth={1.5} />
              <p className="text-lg font-medium">
                {searchQuery ? `No se encontraron favoritos para "${searchQuery}"` : 'Aun no tienes productos favoritos.'}
              </p>
            </div>
          ) : (
            /* Grid de productos favoritos */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  isLiked={true} // Siempre está en favoritos
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

export default Favoritos;
