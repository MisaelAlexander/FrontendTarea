import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

/**
 * Hook para la página Favoritos.
 * Maneja: carga de favoritos con detalles del producto, eliminar favorito, filtrado.
 */
export function useFavoritos() {
  // Contexto de autenticación
  const { user } = useAuth();
  // Contexto de búsqueda
  const { searchQuery } = useSearch();

  // Estado: productos favoritos con sus detalles completos
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  // Estado: indicador de carga
  const [loading, setLoading] = useState(true);
  // Estado: producto seleccionado para modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Estado: control del modal de checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /**
   * Efecto: carga los productos favoritos con sus detalles.
   * Primero obtiene los IDs de favoritos, luego carga cada producto individualmente.
   */
  useEffect(() => {
    if (user?.id) {
      api.getFavorites(user.id)
        .then(favs => {
          // Extrae los IDs de los favoritos
          const ids = favs.map(f => f._id || f);
          // Carga los detalles de cada producto en paralelo
          return Promise.all(ids.map(id => api.getProductById(id).catch(() => null)));
        })
        .then(products => setFavoriteProducts(products.filter(Boolean))) // Filtra nulls
        .catch(err => console.error('Error loading favorites:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // No hay usuario, termina carga
    }
  }, [user]);

  /**
   * Elimina un producto de favoritos.
   * @param {string} productId - ID del producto a eliminar
   */
  const toggleFavorite = async (productId) => {
    if (!user?.id) return;
    try {
      await api.toggleFavorite(user.id, productId);
      // Elimina el producto de la lista local
      setFavoriteProducts(prev => prev.filter(p => (p._id || p.id) !== productId));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  /**
   * Filtra favoritos por nombre según la búsqueda.
   */
  const filteredProducts = favoriteProducts.filter(product => {
    const query = searchQuery.toLowerCase();
    const name = product.nombre || product.title || '';
    return name.toLowerCase().includes(query);
  });

  return {
    filteredProducts,        // Favoritos filtrados
    loading,                 // Estado de carga
    searchQuery,             // Búsqueda actual
    selectedProduct,         // Producto seleccionado
    setSelectedProduct,      // Setter del producto
    isCheckoutOpen,          // Estado del checkout
    setIsCheckoutOpen,       // Setter del checkout
    toggleFavorite,          // Función para eliminar favorito
  };
}
