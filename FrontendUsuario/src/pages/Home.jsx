import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/card';
import ProductDetailsModal from '../components/productdetailsModal';
import Carousel from '../components/carrusel';
import CartSidebar from '../components/cardSidebar';
import CheckoutModal from '../components/checkoutModal';
import { useCart } from '../context/CartContext';
import { useHome } from '../hooks/useHome';

/**
 * Página de inicio (Home).
 * Muestra: carrusel de banners, productos destacados, banner de bienvenida.
 */
const Home = () => {
  // Función para agregar al carrito del contexto
  const { addToCart } = useCart();

  // Obtiene toda la lógica del hook personalizado
  const {
    user,                    // Usuario autenticado (null si no está logueado)
    productsData,            // Lista de productos destacados (máx 4)
    favoriteIds,             // IDs de productos favoritos
    loading,                 // Estado de carga inicial
    selectedProduct,         // Producto seleccionado para ver detalles
    setSelectedProduct,      // Función para seleccionar producto
    isCheckoutOpen,          // Estado del modal de checkout
    setIsCheckoutOpen,       // Función para abrir/cerrar checkout
    toggleFavorite,          // Función para alternar favorito
  } = useHome();

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

      {/* Carrusel de banners promocionales */}
      <Carousel />

      {/* Banner de bienvenida - solo visible para usuarios no autenticados */}
      {!user && (
        <div className="bg-gradient-to-r from-[#2596be] to-[#1e7a9b] text-white py-6 px-4 mb-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Bienvenido a Techne Meraki</h2>
              <p className="text-sm opacity-90">Inicia sesion para guardar favoritos y realizar pedidos</p>
            </div>
            <div className="flex gap-3">
              <Link to="/login" className="bg-white text-[#2596be] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-100">
                Iniciar Sesion
              </Link>
              <Link to="/registro" className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-white/10">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sección de productos destacados */}
      <section className="mb-12">
        <div className="flex items-center justify-between px-[5%] mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Productos Destacados</h2>
          <Link to="/dashboard" className="text-[#2596be] hover:underline text-sm font-medium">
            Ver todos →
          </Link>
        </div>

        {/* Estados de carga y vacío */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Cargando productos...</div>
        ) : productsData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No se encontraron productos</div>
        ) : (
          /* Grid de productos - responsive: 1 columna en móvil, 4 en desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-[5%]">
            {productsData.map(product => (
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

export default Home;
