import axios from 'axios';
const API_URL = 'http://localhost:4000/api';

export const getPromociones = async () => {
  const res = await axios.get(`${API_URL}/promocion`);
  return res.data;
};

export const createPromocion = async (promocion) => {
  const res = await axios.post(`${API_URL}/promocion`, promocion);
  return res.data;
};

export const updatePromocion = async (id, promocion) => {
  const res = await axios.put(`${API_URL}/promocion/${id}`, promocion);
  return res.data;
};

export const deletePromocion = async (id) => {
  const res = await axios.delete(`${API_URL}/promocion/${id}`);
  return res.data;
};

// Opcional: búsqueda por nombre de producto
export const searchPromocionByProducto = async (nombre) => {
  const res = await axios.post(`${API_URL}/promocion/search-by-producto`, { nombre });
  return res.data;
};