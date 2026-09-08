// Cliente API móvil — port de FrontendUsuario/src/services/api.js
// En Expo Go el celular no alcanza localhost, por defecto apunta a Render.
export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || 'https://frontendtarea.onrender.com/api';

// Token del registro en curso (el móvil no maneja cookies httpOnly)
let pendingVerificationToken = null;

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

const api = {
  async login(usuario, password) {
    const res = await fetch(`${API_BASE}/login/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contraseña: password }),
    });
    return handle(res, 'Error al iniciar sesión');
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/login/logout`, { method: 'POST' });
    } catch {}
    return { message: 'Sesión cerrada' };
  },

  async register(nombre, apellido, usuario, password, correo) {
    const res = await fetch(`${API_BASE}/registrar-cliente/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, usuario, contraseña: password, correo }),
    });
    const data = await handle(res, 'Error al registrar');
    pendingVerificationToken = data.verificationToken || null;
    return data;
  },

  async verifyRegisterCode(code) {
    const res = await fetch(`${API_BASE}/registrar-cliente/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verificationCodeRequest: code, verificationToken: pendingVerificationToken }),
    });
    const data = await handle(res, 'Error al verificar código');
    pendingVerificationToken = null;
    return data;
  },

  async requestRecoveryCode(correo) {
    const res = await fetch(`${API_BASE}/recuperar-cliente/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo }),
    });
    return handle(res, 'Error al solicitar código');
  },

  async getProducts() {
    const res = await fetch(`${API_BASE}/producto`);
    return handle(res, 'Error al obtener productos');
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/producto/${id}`);
    return handle(res, 'Producto no encontrado');
  },

  async searchProducts(nombre) {
    const res = await fetch(`${API_BASE}/producto/search?nombre=${encodeURIComponent(nombre)}`);
    return handle(res, 'No se encontraron productos');
  },

  async getPromotions() {
    const res = await fetch(`${API_BASE}/promocion`);
    return handle(res, 'Error al obtener promociones');
  },

  async getBanners() {
    const res = await fetch(`${API_BASE}/banner`);
    return handle(res, 'Error al obtener banners');
  },

  async getFavorites(clientId) {
    const res = await fetch(`${API_BASE}/cliente/${clientId}`);
    const data = await handle(res, 'Error al obtener favoritos');
    return data.Favoritos || [];
  },

  async toggleFavorite(clientId, productId) {
    const res = await fetch(`${API_BASE}/cliente/${clientId}/favoritos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId: productId }),
    });
    return handle(res, 'Error al actualizar favoritos');
  },

  async getCartByClient(clientId) {
    const res = await fetch(`${API_BASE}/carrito`);
    const allCarts = await handle(res, 'Error al obtener carrito');
    if (!Array.isArray(allCarts)) return null;
    return allCarts.find((c) => c.IDCliente?._id === clientId || c.IDCliente === clientId) || null;
  },

  async createCart(IDCliente, Productos, Descuento = 0) {
    const res = await fetch(`${API_BASE}/carrito`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IDCliente, Productos, Descuento }),
    });
    return handle(res, 'Error al crear carrito');
  },

  async updateCart(cartId, IDCliente, Productos, Descuento = 0) {
    const res = await fetch(`${API_BASE}/carrito/${cartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IDCliente, Productos, Descuento }),
    });
    return handle(res, 'Error al actualizar carrito');
  },

  async createOrder(cartId, tipoPago = 'card', extras = {}) {
    const res = await fetch(`${API_BASE}/pedido`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idCarrito: cartId, tipoPago, ...extras }),
    });
    return handle(res, 'Error al crear pedido');
  },

  async getClient(clientId) {
    const res = await fetch(`${API_BASE}/cliente/${clientId}`);
    return handle(res, 'Error al obtener cliente');
  },

  // Wompi - Cobro directo con tarjeta (el backend maneja el token OAuth).
  // payload: { monto, emailCliente, nombreCliente, tarjeta: { numeroTarjeta, cvv, mesVencimiento, anioVencimiento }, formaPago, cantidadCuotas, idExterno }
  async wompiCobro(payload) {
    const res = await fetch(`${API_BASE}/wompi/cobro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.mensaje || 'Error en el cobro');
    return data;
  },

  async getOrdersByClient(clientId) {
    const res = await fetch(`${API_BASE}/pedido/cliente/${clientId}`);
    return handle(res, 'Error al obtener pedidos');
  },

  async getCommentsByProduct(productId) {
    const res = await fetch(`${API_BASE}/comentario`);
    const all = await handle(res, 'Error al obtener comentarios');
    return all.filter((c) => c.IDProductos?._id === productId || c.IDProductos === productId);
  },
};

export default api;
