import { createContext, useContext, useState, useCallback, useRef } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const cartLoadedRef = useRef(false);

  // Load cart from backend when user logs in (only once)
  const loadCart = useCallback(async (userId) => {
    if (!userId) return;
    if (cartLoadedRef.current) return;
    cartLoadedRef.current = true;
    setClientId(userId);
    try {
      const cart = await api.getCartByClient(userId);
      if (cart && cart.Productos && cart.Productos.length > 0) {
        setCartId(cart._id);
        const items = cart.Productos
          .filter(p => p.IDProducto)
          .map(p => {
            const prod = p.IDProducto;
            const image = prod.imagenesProductos?.[0]?.imagen || '';
            return {
              id: prod._id,
              title: prod.nombre || 'Producto',
              price: Number(prod.precio) || 0,
              image,
              quantity: p.amount || 1,
              stock: Number(prod.stock) || 0,
              descuento: Number(prod.descuento) || 0,
              originalProduct: prod,
            };
          });
        setCartItems(items);
      } else {
        setCartItems([]);
        setCartId(null);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    const productId = product._id || product.id;
    const price = Number(product.precio || product.price) || 0;
    const name = product.nombre || product.title || 'Producto';
    const image = product.imagenesProductos?.[0]?.imagen || product.image || '';
    const stock = Number(product.stock) || 0;
    const descuento = Number(product.descuento) || 0;

    let newItems;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        newItems = prev.map(item =>
          item.id === productId
            ? { ...item, quantity: Math.min(stock, item.quantity + quantity) }
            : item
        );
      } else {
        newItems = [...prev, {
          id: productId,
          title: name,
          price,
          image,
          quantity: Math.min(stock, quantity),
          stock,
          descuento,
          originalProduct: product,
        }];
      }
      syncCart(newItems, cartId, clientId);
      return newItems;
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, change) => {
    let newItems;
    setCartItems(prev => {
      newItems = prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          if (newQty < 1) return item;
          if (item.stock && newQty > item.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      });
      syncCart(newItems, cartId, clientId);
      return newItems;
    });
  };

  const removeItem = (id) => {
    let newItems;
    setCartItems(prev => {
      newItems = prev.filter(item => item.id !== id);
      syncCart(newItems, cartId, clientId);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartId(null);
    cartLoadedRef.current = false;
  };

  const checkout = async (tipoPago) => {
    if (!cartId) throw new Error('No hay carrito para procesar');
    const currentCartId = cartId;

    // 1. Crear pedido
    await api.createOrder(currentCartId, tipoPago);

    // 2. Eliminar carrito en backend
    await api.deleteCart(currentCartId);

    // 3. Limpiar carrito en frontend
    clearCart();
  };

  // Sync cart state to backend
  const syncCart = useCallback(async (items, id, cId) => {
    if (!cId) return;
    const productos = items.map(item => ({
      IDProducto: item.id,
      amount: item.quantity,
    }));
    try {
      if (id) {
        await api.updateCart(id, cId, productos);
      } else if (productos.length > 0) {
        const result = await api.createCart(cId, productos);
        if (result?.carrito?._id) setCartId(result.carrito._id);
      }
    } catch (err) {
      console.error('Error syncing cart:', err);
    }
  }, []);

  const total = cartItems.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const descuento = Number(item.descuento) || 0;
    const subtotal = itemPrice * item.quantity;
    const discount = descuento > 0 ? subtotal * (descuento / 100) : 0;
    return sum + subtotal - discount;
  }, 0);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartId,
        clientId,
        isCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        checkout,
        setCartId,
        loadCart,
        total,
        subtotal,
        totalItems,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
