import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const getAdministradores = async () => {
  const res = await axios.get(`${API_URL}/admin`);
  return res.data;
};

export const getAdministradorById = async (id) => {
  const res = await axios.get(`${API_URL}/admin/${id}`);
  return res.data;
};

export const createAdministrador = async (formData) => {
  const res = await axios.post(`${API_URL}/admin`, formData);
  return res.data;
};

export const updateAdministrador = async (id, formData) => {
  const res = await axios.put(`${API_URL}/admin/${id}`, formData);
  return res.data;
};

export const deleteAdministrador = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/${id}`);
  return res.data;
};

export const searchAdministradores = async (query) => {
  const res = await axios.get(`${API_URL}/admin/buscar?nombre=${query}`);
  return res.data;
};