import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';

/**
 * Hook para la página Pagos.
 * Maneja: método de pago, datos de pedido desde localStorage, cobro Wompi con tarjeta.
 */
export function usePagos() {
  // Navegador para redirecciones
  const navigate = useNavigate();
  // Datos del carrito y función de checkout del contexto
  const { cartItems, cartId, total, subtotal, checkout } = useCart();
  // Usuario autenticado (para correo/nombre del cobro)
  const { user } = useAuth();
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

  // Formulario de tarjeta (cargo directo Wompi)
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cuotas, setCuotas] = useState('3');

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
   */
  const descuento = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const desc = Number(item.descuento) || 0;
    const subtotalItem = price * item.quantity;
    return sum + (desc > 0 ? subtotalItem * (desc / 100) : 0);
  }, 0); // Acumulador inicial en 0

  /**
   * Confirma un pedido sin tarjeta (efectivo, bitcoin, transferencia).
   */
  const confirmOfflineOrder = async () => {
    await checkout(paymentMethod);
    localStorage.removeItem('orderData');
    toast.success('Pedido confirmado con exito!');
    navigate('/pedidos');
  };

  /**
   * Cobra con tarjeta vía Wompi (cargo directo) y luego crea el pedido.
   */
  const payWithCard = async () => {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 15) {
      toast.warning('Número de tarjeta inválido');
      return;
    }
    const m = expDate.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!m) {
      toast.warning('Fecha inválida (usa MM/AA)');
      return;
    }
    if (!/^\d{3,4}$/.test(cvc.trim())) {
      toast.warning('CVC inválido');
      return;
    }

    // Datos del cliente para el cobro
    let emailCliente = '';
    let nombreCliente = user?.nombre || user?.usuario || 'Cliente';
    try {
      if (user?.id) {
        const client = await api.getClient(user.id);
        emailCliente = client.correo || '';
        nombreCliente = `${client.nombre || ''} ${client.apellido || ''}`.trim() || nombreCliente;
      }
    } catch {
      // Sigue con los datos básicos
    }
    if (!emailCliente) {
      toast.warning('No se encontró el correo del cliente');
      return;
    }

    const cobro = await api.wompiCobro({
      monto: Number(total),
      emailCliente,
      nombreCliente,
      tarjeta: {
        numeroTarjeta: digits,
        cvv: cvc.trim(),
        mesVencimiento: Number(m[1]),
        anioVencimiento: Number(m[2]),
      },
      formaPago: isPlazos ? 2 : 0,
      cantidadCuotas: isPlazos ? Number(cuotas) : undefined,
      idExterno: cartId,
    });

    // Si Wompi pide autenticación 3DS en otra página, abrirla
    const redirectUrl = cobro.urlAutenticacion || cobro.url || cobro.redirectUrl;
    if (!cobro.esAprobada && redirectUrl) {
      window.open(redirectUrl, '_blank');
      toast.warning('Completa la verificación 3DS en la ventana abierta');
      return;
    }

    if (!cobro.esAprobada) {
      throw new Error(cobro.mensaje || 'Pago rechazado por el banco');
    }

    await checkout('card', {
      idTransaccionWompi: cobro.idTransaccion,
      codigoAutorizacion: cobro.codigoAutorizacion,
      estadoPago: 'aprobada',
    });
    localStorage.removeItem('orderData');
    toast.success(`Pago aprobado (aut. ${cobro.codigoAutorizacion || 'N/A'})`);
    navigate('/pedidos');
  };

  /**
   * Procesa el pago según el método y redirige a pedidos.
   */
  const handlePayment = async () => {
    setLoading(true);
    try {
      if (paymentMethod === 'card') {
        await payWithCard();
      } else {
        await confirmOfflineOrder();
      }
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
    cardNumber, setCardNumber,
    expDate, setExpDate,
    cvc, setCvc,
    cuotas, setCuotas,
    handlePayment,           // Función para procesar el pago
  };
}
