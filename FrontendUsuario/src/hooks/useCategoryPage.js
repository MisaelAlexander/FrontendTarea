import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useSearch } from '../context/SearchContext';

/**
 * Hook para la página CategoryPage.
 * Maneja: carga de productos, filtrado por categoría y búsqueda, favoritos locales.
 */
export function useCategoryPage() {
  // Obtiene el nombre de la categoría de la URL
  const { categoryName } = useParams();
  // Contexto de búsqueda
  const { searchQuery } = useSearch();

  // Estado: lista completa de productos
  const [productsData, setProductsData] = useState([]);
  // Estado: IDs de favoritos (local, sin persistencia en API)
  const [favoriteIds, setFavoriteIds] = useState([]);
  // Estado: indicador de carga
  const [loading, setLoading] = useState(true);
  // Estado: producto seleccionado para modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Estado: control del checkout
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
   * Alterna un favorito localmente (sin llamada a API).
   * Solo modifica el estado local.
   * @param {string} id - ID del producto
   */
  const toggleFavorite = (id) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  /**
   * Filtra productos por categoría Y búsqueda.
   * Debe cumplir ambas condiciones para aparecer en la lista.
   */
  const filteredProducts = productsData.filter(product => {
    const category = product.categoria || product.category || '';
    const name = product.nombre || product.title || '';
    // Coincidencia exacta de categoría (case-insensitive)
    const categoryMatch = category.toLowerCase() === categoryName?.toLowerCase();
    // Coincidencia parcial de búsqueda (si hay búsqueda)
    const queryMatch = searchQuery === '' ? true : (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return categoryMatch && queryMatch;
  });

  return {
    categoryName,            // Nombre de la categoría de la URL
    filteredProducts,        // Productos filtrados
    favoriteIds,             // IDs de favoritos locales
    loading,                 // Estado de carga
    searchQuery,             // Búsqueda actual
    selectedProduct,         // Producto seleccionado
    setSelectedProduct,      // Setter del producto
    isCheckoutOpen,          // Estado del checkout
    setIsCheckoutOpen,       // Setter del checkout
    toggleFavorite,          // Función de favoritos local
  };
}
