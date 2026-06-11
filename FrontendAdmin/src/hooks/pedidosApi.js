import axios from 'axios';
const API_URL =  'http://localhost:4000/api';

export const getPedidos = async () => {
  const res = await axios.get(`${API_URL}/pedido`);
  return res.data;
};

export const getPedidoById = async (id) => {
  const res = await axios.get(`${API_URL}/pedido/${id}`);
  return res.data;
};