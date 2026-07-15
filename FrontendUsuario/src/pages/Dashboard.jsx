import React from 'react';
import { useCart } from '../context/CartContext';
import CartSidebar from '../components/cardSidebar';
import CheckoutModal from '../components/checkoutModal';
import ProductCard from '../components/card';
import ProductDetailsModal from '../components/productdetailsModal';
import { useDashboard } from '../hooks/useDashboard';

/**
 * Página de Dashboard (Productos).
 * Muestra todos los productos con filtrado por búsqueda en tiempo real.
 */
const Dashboard = () => {
  // Función para agregar al carrito del contexto
  const { addToCart } = useCart();

  // Obtiene toda la lógica del hook personalizado
  const {
    filteredProducts,        // Productos filtrados por búsqueda
    favoriteIds,             // IDs de favoritos del usuario
    loading,                 // Estado de carga
    searchQuery,             // Texto de búsqueda actual
    selectedProduct,         // Producto seleccionado para modal
    setSelectedProduct,      // Función para seleccionar producto
    isCheckoutOpen,          // Estado del modal de checkout
    setIsCheckoutOpen,       // Función para abrir/cerrar checkout
    toggleFavorite,          // Función para alternar favorito
  } = useDashboard();

  return (
    <>
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

      {/* Sección principal de productos */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 px-[5%]">Todos los Productos</h2>

        {/* Estados de carga, vacío y resultados */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 px-[5%]">Cargando productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 px-[5%]">
            No se encontraron productos para "{searchQuery}"
          </div>
        ) : (
          /* Grid de productos - responsive */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-[5%]">
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                isLiked={favoriteIds.includes(product._id)}
                onToggleLike={toggleFavorite}
                onAddToCart={addToCart}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Dashboard;
