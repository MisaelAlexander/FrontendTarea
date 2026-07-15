import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

/**
 * Hook para la página Promociones.
 * Maneja: carga de promociones, agregar al carrito con descuento, auth check.
 */
export function usePromociones() {
  // Contexto de autenticación
  const { user } = useAuth();
  // Función para agregar al carrito del contexto
  const { addToCart } = useCart();
  // Sistema de notificaciones
  const toast = useToast();

  // Estado: lista de promociones activas
  const [promociones, setPromociones] = useState([]);
  // Estado: indicador de carga
  const [loading, setLoading] = useState(true);
  // Estado: producto seleccionado para modal de detalles
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Estado: control del modal de checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /**
   * Efecto: carga todas las promociones al montar.
   */
  useEffect(() => {
    api.getPromotions()
      .then(setPromociones)
      .catch(err => console.error('Error loading promotions:', err))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Formatea una fecha a formato corto en español.
   * @param {string} dateStr - Fecha ISO
   * @returns {string} Fecha formateada (ej: "15 jul. 2026")
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  /**
   * Agrega un producto con descuento al carrito.
   * Valida autenticación antes de agregar.
   * @param {Object} producto - Producto base
   * @param {number} descuento - Porcentaje de descuento de la promoción
   */
  const handleAddToCart = (producto, descuento) => {
    if (!user?.id) {
      toast.warning('Debes iniciar sesion para agregar al carrito');
      return;
    }
    // Agrega el descuento al producto antes de enviarlo al carrito
    const productWithDiscount = {
      ...producto,           // Copia todas las propiedades
      descuento: descuento   // Agrega/ sobreescribe el descuento
    };
    addToCart(productWithDiscount);
  };

  return {
    promociones,             // Lista de promociones
    loading,                 // Estado de carga
    selectedProduct,         // Producto seleccionado
    setSelectedProduct,      // Setter del producto
    isCheckoutOpen,          // Estado del checkout
    setIsCheckoutOpen,       // Setter del checkout
    formatDate,              // Función para formatear fechas
    handleAddToCart,         // Función para agregar con descuento
  };
}
