import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

/**
 * Hook para el componente CheckoutModal.
 * Maneja: método de entrega, método de pago, validación, datos de envío.
 */
export function useCheckout(isOpen) {
  // Navegador para redirección a pagos
  const navigate = useNavigate();
  // Datos del carrito del contexto
  const { cartItems, total, subtotal } = useCart();
  // Sistema de notificaciones
  const toast = useToast();

  // Estado: método de entrega ('store' o 'home')
  const [deliveryMethod, setDeliveryMethod] = useState('store');
  // Estado: método de pago ('card', 'cash', 'crypto', 'transfer')
  const [paymentMethod, setPaymentMethod] = useState('card');
  // Estado: sucursal seleccionada (para retiro en tienda)
  const [sucursal, setSucursal] = useState('Metrocentro San Salvador');
  // Estado: dirección de envío (para envío a domicilio)
  const [direccion, setDireccion] = useState('');
  // Estado: teléfono de contacto (para envío a domicilio)
  const [telefono, setTelefono] = useState('');
  // Estado: notas adicionales (opcional)
  const [notas, setNotas] = useState('');

  /**
   * Calcula el descuento total de todos los items del carrito.
   */
  const descuento = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const desc = Number(item.descuento) || 0;
    const subtotalItem = price * item.quantity;
    return sum + (desc > 0 ? subtotalItem * (desc / 100) : 0);
  }, 0);

  /**
   * Valida los datos y continúa al paso de pago.
   * Guarda los datos del pedido en localStorage para la página de pagos.
   */
  const handleContinue = () => {
    // Validación: envío a domicilio requiere dirección
    if (deliveryMethod === 'home' && !direccion.trim()) {
      toast.warning('Por favor ingresa tu direccion de envio');
      return;
    }
    // Validación: envío a domicilio requiere teléfono
    if (deliveryMethod === 'home' && !telefono.trim()) {
      toast.warning('Por favor ingresa tu telefono');
      return;
    }

    // Construye el objeto con los datos del pedido
    const orderData = {
      deliveryMethod,
      paymentMethod,
      sucursal: deliveryMethod === 'store' ? sucursal : null,
      direccion: deliveryMethod === 'home' ? direccion : null,
      telefono: deliveryMethod === 'home' ? telefono : null,
      notas,
    };

    // Guarda en localStorage para que Pagos.jsx los lea
    localStorage.setItem('orderData', JSON.stringify(orderData));
    navigate('/pagos'); // Redirige a la página de pagos
  };

  return {
    cartItems,               // Items del carrito
    total,                   // Total del carrito
    subtotal,                // Subtotal
    descuento,               // Descuento calculado
    deliveryMethod,          // Método de entrega
    setDeliveryMethod,       // Setter del método de entrega
    paymentMethod,           // Método de pago
    setPaymentMethod,        // Setter del método de pago
    sucursal,                // Sucursal seleccionada
    setSucursal,             // Setter de sucursal
    direccion,               // Dirección de envío
    setDireccion,            // Setter de dirección
    telefono,                // Teléfono
    setTelefono,             // Setter de teléfono
    notas,                   // Notas adicionales
    setNotas,                // Setter de notas
    handleContinue,          // Función para continuar al pago
  };
}
