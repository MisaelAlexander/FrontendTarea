import React from 'react';
import CartSidebar from '../components/cardSidebar';
import CheckoutModal from '../components/checkoutModal';
import ProductDetailsModal from '../components/productdetailsModal';
import { usePromociones } from '../hooks/usePromociones';
import { Tag, Calendar, Package } from 'lucide-react';

/**
 * Página de Promociones.
 * Muestra las promociones activas con sus productos y descuentos aplicados.
 */
const Promociones = () => {
  // Obtiene toda la lógica del hook personalizado
  const {
    promociones,             // Lista de promociones activas
    loading,                 // Estado de carga
    selectedProduct,         // Producto seleccionado para modal
    setSelectedProduct,      // Función para seleccionar producto
    isCheckoutOpen,          // Estado del modal de checkout
    setIsCheckoutOpen,       // Función para abrir/cerrar checkout
    formatDate,              // Función para formatear fechas
  } = usePromociones();

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-8 px-4">
      {/* Sidebar del carrito */}
      <CartSidebar onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Modal de checkout */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Modal de detalles del producto */}
      <ProductDetailsModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Promociones</h1>

        {/* Estados de carga, vacío y resultados */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <p>Cargando promociones...</p>
          </div>
        ) : promociones.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Tag className="w-16 h-16 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="text-lg font-medium">No hay promociones disponibles en este momento.</p>
          </div>
        ) : (
          /* Lista de promociones */
          <div className="space-y-8">
            {promociones.map(promo => (
              <div key={promo._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header de la promoción con descuento y fechas */}
                <div className="bg-gradient-to-r from-[#2596be] to-[#1e7a9b] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Tag className="h-6 w-6" />
                      <span className="text-3xl font-bold">{promo.descuento}% OFF</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(promo.fechaInicio)} - {formatDate(promo.fechaFinalizacion)}</span>
                    </div>
                  </div>
                </div>

                {/* Productos con descuento */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">Productos con descuento:</span>
                  </div>

                  {promo.IDproductos && promo.IDproductos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {promo.IDproductos.map((item, idx) => {
                        const producto = item.productos;
                        if (!producto) return null;

                        // Calcula precios
                        const precioOriginal = Number(producto.precio || 0);
                        const precioDescuento = precioOriginal * (1 - promo.descuento / 100);
                        const image = producto.imagenesProductos?.[0]?.imagen || '';

                        return (
                          <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex gap-3">
                              {/* Imagen del producto */}
                              {image && (
                                <div
                                  className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
                                  onClick={() => setSelectedProduct(producto)}
                                >
                                  <img src={image} alt={producto.nombre} className="w-12 h-12 object-contain" />
                                </div>
                              )}
                              {/* Info del producto */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className="font-semibold text-gray-800 text-sm truncate cursor-pointer hover:text-[#2596be]"
                                  onClick={() => setSelectedProduct(producto)}
                                >
                                  {producto.nombre || 'Producto sin nombre'}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[#2596be] font-bold text-sm">$ {precioDescuento.toFixed(2)}</span>
                                  <span className="text-gray-400 text-xs line-through">$ {precioOriginal.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Sin productos asignados</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promociones;
