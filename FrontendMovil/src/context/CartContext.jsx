import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/client';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
};

const numOr = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

const toItem = (prod, quantity) => ({
  id: prod._id,
  title: prod.nombre || 'Producto',
  price: numOr(prod.precio, 0),
  image: prod.imagenesProductos?.[0]?.imagen || '',
  quantity,
  stock: numOr(prod.stock, 99),
  descuento: numOr(prod.descuento, 0),
  originalProduct: prod,
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [clientId, setClientId] = useState(null);

  const loadCart = useCallback(async (userId) => {
    if (!userId) return;
    setClientId(userId);
    try {
      const cart = await api.getCartByClient(userId);
      if (cart?.Productos?.length > 0) {
        setCartId(cart._id);
        setCartItems(
          cart.Productos.filter((p) => p.IDProducto?._id || p.IDProducto).map((p) => {
            const prod = p.IDProducto;
            if (typeof prod === 'string') return null;
            return toItem(prod, p.amount || 1);
          }).filter(Boolean)
        );
      } else {
        setCartItems([]);
        setCartId(null);
      }
    } catch (e) {
      console.log('Error loading cart:', e.message);
    }
  }, []);

  const syncCart = useCallback(async (items, id, cId) => {
    if (!cId) return;
    const productos = items.map((i) => ({ IDProducto: i.id, amount: i.quantity }));
    try {
      if (productos.length === 0) {
        // Vacío: eliminar en el servidor en vez de mandar un PUT vacío (la API lo rechaza).
        if (id) {
          await api.deleteCart(id);
          setCartId(null);
        }
      } else if (id) {
        await api.updateCart(id, cId, productos);
      } else {
        const result = await api.createCart(cId, productos);
        if (result?.carrito?._id) setCartId(result.carrito._id);
      }
    } catch (e) {
      console.log('Error syncing cart:', e.message);
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    const pid = product._id || product.id;
    const stock = numOr(product.stock, 99);
    if (!product.nombre || stock < 1 || quantity < 1) return false;
    let added = false;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === pid);
      let next;
      if (existing) {
        if (existing.quantity + quantity > existing.stock) return prev;
        next = prev.map((i) => (i.id === pid ? { ...i, quantity: i.quantity + quantity } : i));
      } else {
        next = [...prev, toItem(product, Math.min(stock, quantity))];
      }
      added = true;
      syncCart(next, cartId, clientId);
      return next;
    });
    return added;
  };

  const updateQuantity = (id, change) => {
    setCartItems((prev) => {
      const next = prev.map((i) => {
        if (i.id !== id) return i;
        const q = i.quantity + change;
        if (q < 1) return i;
        if (i.stock && q > i.stock) return i;
        return { ...i, quantity: q };
      });
      syncCart(next, cartId, clientId);
      return next;
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      syncCart(next, cartId, clientId);
      return next;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartId(null);
  };

  // Revalida stock con datos frescos antes de crear el pedido.
  const revalidateStock = async (items) => {
    for (const i of items) {
      const fresh = await api.getProductById(i.id);
      const stock = Number(fresh?.stock);
      if (!Number.isFinite(stock) || stock < i.quantity) {
        throw new Error(
          `Stock insuficiente para "${i.title}". Disponible: ${Number.isFinite(stock) ? stock : 0}`
        );
      }
    }
  };

  const checkout = async (tipoPago = 'card', extras = {}) => {
    if (!cartId) throw new Error('No hay carrito para procesar');
    if (cartItems.length === 0) throw new Error('El carrito está vacío');
    await revalidateStock(cartItems);
    await api.createOrder(cartId, tipoPago, extras);
    clearCart();
  };

  const total = cartItems.reduce((s, i) => {
    const sub = i.price * i.quantity;
    return s + sub - (i.descuento > 0 ? sub * (i.descuento / 100) : 0);
  }, 0);

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, cartId, clientId, addToCart, updateQuantity, removeItem, clearCart, checkout, loadCart, setClientId, total, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};
