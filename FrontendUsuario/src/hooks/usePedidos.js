import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Hook para la página Pedidos.
 * Maneja: carga de pedidos del usuario, formato de fechas.
 */
export function usePedidos() {
  // Contexto de autenticación
  const { user } = useAuth();

  // Estado: lista de pedidos del usuario
  const [pedidos, setPedidos] = useState([]);
  // Estado: indicador de carga
  const [loading, setLoading] = useState(true);
  // Estado: pedido seleccionado para ver detalles
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Estado: control del modal de checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /**
   * Efecto: carga los pedidos del usuario autenticado.
   * Si no hay usuario, termina la carga sin datos.
   */
  useEffect(() => {
    if (user?.id) {
      api.getOrdersByClient(user.id)
        .then(setPedidos)
        .catch(err => console.error('Error loading orders:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // No hay usuario
    }
  }, [user]);

  /**
   * Formatea una fecha ISO a formato legible en español.
   * @param {string} dateStr - Fecha en formato ISO
   * @returns {string} Fecha formateada (ej: "15 jul. 2026, 10:30")
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',    // Día con 2 dígitos
      month: 'short',    // Mes abreviado (ene, feb, mar...)
      year: 'numeric',   // Año completo
      hour: '2-digit',   // Hora con 2 dígitos
      minute: '2-digit'  // Minutos con 2 dígitos
    });
  };

  return {
    pedidos,                 // Lista de pedidos
    loading,                 // Estado de carga
    selectedOrder,           // Pedido seleccionado para detalles
    setSelectedOrder,        // Setter del pedido seleccionado
    isCheckoutOpen,          // Estado del checkout
    setIsCheckoutOpen,       // Setter del checkout
    formatDate,              // Función para formatear fechas
  };
}
