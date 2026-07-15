import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

/**
 * Hook para la página Dashboard.
 * Maneja: carga de productos, favoritos, filtrado por búsqueda.
 */
export function useDashboard() {
  // Contexto de autenticación
  const { user } = useAuth();
  // Contexto de búsqueda para filtrar productos
  const { searchQuery } = useSearch();

  // Estado: lista completa de productos
  const [productsData, setProductsData] = useState([]);
  // Estado: IDs de productos favoritos del usuario
  const [favoriteIds, setFavoriteIds] = useState([]);
  // Estado: indicador de carga
  const [loading, setLoading] = useState(true);
  // Estado: producto seleccionado para modal de detalles
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Estado: control del modal de checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /**
   * Efecto: carga todos los productos al montar.
   */
  useEffect(() => {
    api.getProducts()
      .then(setProductsData)
      .catch(err => console.error('Error loading products:', err))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Efecto: carga favoritos del usuario cuando cambia la sesión.
   */
  useEffect(() => {
    if (user?.id) {
      api.getFavorites(user.id)
        .then(favs => setFavoriteIds(favs.map(f => f._id || f)))
        .catch(err => console.error('Error loading favorites:', err));
    }
  }, [user]);

  /**
   * Alterna un producto como favorito (actualización optimista).
   * @param {string} productId - ID del producto
   */
  const toggleFavorite = async (productId) => {
    if (!user?.id) return;
    const prev = [...favoriteIds];
    if (prev.includes(productId)) {
      setFavoriteIds(prev.filter(id => id !== productId));
    } else {
      setFavoriteIds([...prev, productId]);
    }
    try {
      await api.toggleFavorite(user.id, productId);
    } catch (err) {
      setFavoriteIds(prev); // Revierte en caso de error
      console.error('Error toggling favorite:', err);
    }
  };

  /**
   * Filtra productos por nombre o categoría según la búsqueda.
   * Se recalcula en cada render cuando cambia searchQuery o productsData.
   */
  const filteredProducts = productsData.filter(product => {
    const query = searchQuery.toLowerCase();
    const name = product.nombre || product.title || '';
    const category = product.categoria || product.category || '';
    // Busca en nombre O categoría
    return name.toLowerCase().includes(query) || category.toLowerCase().includes(query);
  });

  return {
    filteredProducts,        // Productos filtrados por búsqueda
    favoriteIds,             // IDs de favoritos
    loading,                 // Estado de carga
    searchQuery,             // Texto de búsqueda actual
    selectedProduct,         // Producto seleccionado
    setSelectedProduct,      // Setter para producto seleccionado
    isCheckoutOpen,          // Estado del checkout
    setIsCheckoutOpen,       // Setter del checkout
    toggleFavorite,          // Función para favoritos
  };
}
