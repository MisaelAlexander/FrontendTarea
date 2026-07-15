import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

/**
 * Hook para la página Pagos.
 * Maneja: método de pago, datos de pedido desde localStorage, proceso de pago.
 */
export function usePagos() {
  // Navegador para redirecciones
  const navigate = useNavigate();
  // Datos del carrito y función de checkout del contexto
  const { cartItems, total, subtotal, checkout } = useCart();
  // Sistema de notificaciones
  const toast = useToast();

  // Estado: método de pago seleccionado ('card', 'cash', 'crypto', 'transfer')
  const [paymentMethod, setPaymentMethod] = useState('card');
  // Estado: si el pago es a plazos (solo para tarjeta)
  const [isPlazos, setIsPlazos] = useState(false);
  // Estado: indicador de procesamiento de pago
  const [loading, setLoading] = useState(false);
  // Estado: datos del pedido guardados en checkout anterior
  const [orderData, setOrderData] = useState(null);

  /**
   * Efecto: carga los datos del pedido desde localStorage.
   * Estos datos fueron guardados por el CheckoutModal.
   */
  useEffect(() => {
    const saved = localStorage.getItem('orderData');
    if (saved) {
      const data = JSON.parse(saved);
      setOrderData(data);
      setPaymentMethod(data.paymentMethod || 'card'); // Restaura método de pago
    }
  }, []);

  /**
   * Calcula el descuento total aplicado a todos los items del carrito.
   * Recorre cada item y suma los descuentos individuales.
   */
  const descuento = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const desc = Number(item.descuento) || 0;
    const subtotalItem = price * item.quantity;
    // Solo aplica descuento si es mayor a 0
    return sum + (desc > 0 ? subtotalItem * (desc / 100) : 0);
  }, 0); // Acumulador inicial en 0

  /**
   * Procesa el pago y redirige a la página de pedidos.
   * Limpia los datos del pedido de localStorage después del pago exitoso.
   */
  const handlePayment = async () => {
    setLoading(true);
    try {
      await checkout(paymentMethod); // Llama al checkout del contexto del carrito
      localStorage.removeItem('orderData'); // Limpia datos temporales
      toast.success('Pedido confirmado con exito!');
      navigate('/pedidos'); // Redirige a pedidos
    } catch (err) {
      toast.error('Error al confirmar el pedido: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    cartItems,               // Items del carrito
    total,                   // Total del carrito
    subtotal,                // Subtotal sin descuentos
    descuento,               // Descuento total calculado
    paymentMethod,           // Método de pago seleccionado
    setPaymentMethod,        // Setter del método de pago
    isPlazos,                // Si es pago a plazos
    setIsPlazos,             // Setter de plazos
    loading,                 // Estado de procesamiento
    orderData,               // Datos del pedido desde localStorage
    handlePayment,           // Función para procesar pago
  };
}
