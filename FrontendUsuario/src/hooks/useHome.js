import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

/**
 * Hook para la página Home.
 * Maneja: productos destacados, favoritos, agregar al carrito con auth check.
 */
export function useHome() {
  // Contexto de autenticación para verificar si el usuario está logueado
  const { user } = useAuth();
  // Sistema de notificaciones toast
  const toast = useToast();

  // Estado: lista de productos destacados (máximo 4)
  const [productsData, setProductsData] = useState([]);
  // Estado: IDs de productos marcados como favoritos
  const [favoriteIds, setFavoriteIds] = useState([]);
  // Estado: indicador de carga inicial
  const [loading, setLoading] = useState(true);
  // Estado: producto seleccionado para ver detalles en modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Estado: control de apertura del modal de checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /**
   * Efecto: carga los primeros 4 productos al montar el componente.
   * Se ejecuta una vez al inicio (array de dependencias vacío).
   */
  useEffect(() => {
    api.getProducts()
      .then(data => setProductsData(data.slice(0, 4))) // Solo los primeros 4
      .catch(err => console.error('Error loading products:', err))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Efecto: carga los favoritos del usuario cuando cambia el estado de autenticación.
   * Si no hay usuario, limpia la lista de favoritos.
   */
  useEffect(() => {
    if (user?.id) {
      api.getFavorites(user.id)
        .then(favs => setFavoriteIds(favs.map(f => f._id || f))) // Extrae solo los IDs
        .catch(err => console.error('Error loading favorites:', err));
    } else {
      setFavoriteIds([]); // Limpia favoritos si no hay usuario
    }
  }, [user]); // Se ejecuta cuando cambia el usuario

  /**
   * Alterna un producto como favorito.
   * Optimista: actualiza el estado primero, luego confirma con la API.
   * Si falla, revierte el cambio.
   * @param {string} productId - ID del producto a alternar
   */
  const toggleFavorite = async (productId) => {
    // Verifica autenticación
    if (!user?.id) {
      toast.warning('Debes iniciar sesion para guardar favoritos');
      return;
    }
    // Guarda estado anterior para revertir en caso de error
    const prev = [...favoriteIds];
    // Actualización optimista: agrega o quita el ID
    if (prev.includes(productId)) {
      setFavoriteIds(prev.filter(id => id !== productId));
    } else {
      setFavoriteIds([...prev, productId]);
    }
    try {
      // Confirma el cambio con la API
      await api.toggleFavorite(user.id, productId);
    } catch (err) {
      // Revierte el cambio si falla la API
      setFavoriteIds(prev);
      console.error('Error toggling favorite:', err);
    }
  };

  /**
   * Valida autenticación antes de agregar al carrito.
   * Retorna el producto si está autenticado, otherwise muestra toast.
   * @param {Object} product - Producto a agregar
   */
  const handleAddToCart = (product) => {
    if (!user?.id) {
      toast.warning('Debes iniciar sesion para agregar al carrito');
      return;
    }
    // Retorna el producto para que el componente lo use con addToCart del contexto
    return product;
  };

  // Retorna todo el estado y funciones necesarias para la página
  return {
    user,                    // Usuario autenticado (o null)
    productsData,            // Lista de productos destacados
    favoriteIds,             // IDs de favoritos
    loading,                 // Estado de carga
    selectedProduct,         // Producto seleccionado para modal
    setSelectedProduct,      // Función para seleccionar producto
    isCheckoutOpen,          // Estado del modal de checkout
    setIsCheckoutOpen,       // Función para abrir/cerrar checkout
    toggleFavorite,          // Función para alternar favorito
    handleAddToCart,         // Función para agregar al carrito
  };
}
