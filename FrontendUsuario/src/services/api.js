const API_BASE = '/api';

const api = {
  // Auth - Login
  async login(usuario, password) {
    const res = await fetch(`${API_BASE}/login/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ usuario, contraseña: password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesion');
    return data;
  },

  async logout() {
    const res = await fetch(`${API_BASE}/login/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.json();
  },

  async checkSession() {
    const res = await fetch(`${API_BASE}/login/check-session`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.cliente;
  },

  // Register - Step 1: Send verification code
  async register(nombre, apellido, usuario, password, correo) {
    const res = await fetch(`${API_BASE}/registrar-cliente/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, apellido, usuario, contraseña: password, correo }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al registrar');
    return data;
  },

  // Register - Step 2: Verify code
  async verifyRegisterCode(code) {
    const res = await fetch(`${API_BASE}/registrar-cliente/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ verificationCodeRequest: code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al verificar codigo');
    return data;
  },

  // Recovery Password - Step 1: Request code
  async requestRecoveryCode(correo) {
    const res = await fetch(`${API_BASE}/recuperar-cliente/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ correo }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al solicitar codigo');
    return data;
  },

  // Recovery Password - Step 2: Verify code
  async verifyRecoveryCode(code) {
    const res = await fetch(`${API_BASE}/recuperar-cliente/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ codeRequest: code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al verificar codigo');
    return data;
  },

  // Recovery Password - Step 3: Set new password
  async resetPassword(newPassword, confirmNewPassword) {
    const res = await fetch(`${API_BASE}/recuperar-cliente/new-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ newPassword, confirmNewPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al cambiar contraseña');
    return data;
  },

  // Products
  async getProducts() {
    const res = await fetch(`${API_BASE}/producto`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/producto/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return res.json();
  },

  async searchProducts(nombre) {
    const res = await fetch(`${API_BASE}/producto/search?nombre=${encodeURIComponent(nombre)}`);
    if (!res.ok) throw new Error('No se encontraron productos');
    return res.json();
  },

  async getProductsByCategory(categoria) {
    const res = await fetch(`${API_BASE}/producto/category?categoria=${encodeURIComponent(categoria)}`);
    if (!res.ok) throw new Error('No se encontraron productos en esta categoria');
    return res.json();
  },

  // Cart - get all (admin)
  async getAllCarts() {
    const res = await fetch(`${API_BASE}/carrito`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener carritos');
    return res.json();
  },

  async addToCart(productId, quantity = 1) {
    const res = await fetch(`${API_BASE}/carrito`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productoId: productId, cantidad: quantity }),
    });
    if (!res.ok) throw new Error('Error al agregar al carrito');
    return res.json();
  },

  // Orders
  async getOrders() {
    const res = await fetch(`${API_BASE}/pedido`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener pedidos');
    return res.json();
  },

  async getOrdersByClient(clientId) {
    const res = await fetch(`${API_BASE}/pedido/cliente/${clientId}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener pedidos del cliente');
    return res.json();
  },

  // Banners
  async getBanners() {
    const res = await fetch(`${API_BASE}/banner`);
    if (!res.ok) throw new Error('Error al obtener banners');
    return res.json();
  },

  // Promotions
  async getPromotions() {
    const res = await fetch(`${API_BASE}/promocion`);
    if (!res.ok) throw new Error('Error al obtener promociones');
    return res.json();
  },

  // Favorites
  async getFavorites(clientId) {
    const res = await fetch(`${API_BASE}/cliente/${clientId}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al obtener favoritos');
    const data = await res.json();
    return data.Favoritos || [];
  },

  async toggleFavorite(clientId, productId) {
    const res = await fetch(`${API_BASE}/cliente/${clientId}/favoritos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productoId: productId }),
    });
    if (!res.ok) throw new Error('Error al actualizar favoritos');
    return res.json();
  },

  async createOrder(cartId, tipoPago) {
    const res = await fetch(`${API_BASE}/pedido`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ idCarrito: cartId, tipoPago }),
    });
    if (!res.ok) throw new Error('Error al crear pedido');
    return res.json();
  },

  // Cart
  async getCart(cartId) {
    const res = await fetch(`${API_BASE}/carrito/${cartId}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al obtener carrito');
    return res.json();
  },

  async getCartByClient(clientId) {
    const res = await fetch(`${API_BASE}/carrito`, { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener carrito');
    const allCarts = await res.json();
    // Find the cart belonging to this client
    const myCart = Array.isArray(allCarts)
      ? allCarts.find(c => c.IDCliente?._id === clientId || c.IDCliente === clientId)
      : null;
    return myCart || null;
  },

  async createCart(IDCliente, Productos, Descuento = 0) {
    const res = await fetch(`${API_BASE}/carrito`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ IDCliente, Productos, Descuento }),
    });
    if (!res.ok) throw new Error('Error al crear carrito');
    return res.json();
  },

  async updateCart(cartId, IDCliente, Productos, Descuento = 0) {
    const res = await fetch(`${API_BASE}/carrito/${cartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ IDCliente, Productos, Descuento }),
    });
    if (!res.ok) throw new Error('Error al actualizar carrito');
    return res.json();
  },

  async deleteCart(cartId) {
    const res = await fetch(`${API_BASE}/carrito/${cartId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al eliminar carrito');
    return res.json();
  },

  // Comments
  async getCommentsByProduct(productId) {
    const res = await fetch(`${API_BASE}/comentario`);
    if (!res.ok) throw new Error('Error al obtener comentarios');
    const allComments = await res.json();
    return allComments.filter(c => c.IDProductos?._id === productId || c.IDProductos === productId);
  },

  async createComment(Titulo, CuerpoComentario, Resenia, IDCliente, IDProductos) {
    const res = await fetch(`${API_BASE}/comentario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ Titulo, CuerpoComentario, Resenia, IDCliente, IDProductos }),
    });
    if (!res.ok) throw new Error('Error al crear comentario');
    return res.json();
  },
};

export default api;
