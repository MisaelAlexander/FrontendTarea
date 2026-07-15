import axios from 'axios';

/**
 * API de Pedidos para el admin.
 * Obtiene pedidos del backend con información completa (carrito, cliente, productos).
 */
const API_URL = 'http://localhost:4000/api';

/**
 * GET - Obtiene todos los pedidos.
 * Populate anidado: carrito → cliente + productos
 */
export const getPedidos = async () => {
  const res = await axios.get(`${API_URL}/pedido`, {
    withCredentials: true // Necesario para cookies de sesión
  });
  return res.data;
};

/**
 * GET - Obtiene un pedido por ID.
 * @param {string} id - ID del pedido
 */
export const getPedidoById = async (id) => {
  const res = await axios.get(`${API_URL}/pedido/${id}`, {
    withCredentials: true
  });
  return res.data;
};
