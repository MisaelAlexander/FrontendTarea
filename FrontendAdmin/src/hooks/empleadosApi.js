// src/hooks/empleadosApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ========== VENDEDORES ==========
export const getVendedores = async () => {
  const res = await axios.get(`${API_URL}/vendedor`);
  return res.data;
};

export const getVendedorById = async (id) => {
  const res = await axios.get(`${API_URL}/vendedor/${id}`);
  return res.data;
};

export const createVendedor = async (formData) => {
  const res = await axios.post(`${API_URL}/vendedor`, formData, {
    headers: { 'Content-Type': 'form-data' }
  });
  return res.data;
};

export const updateVendedor = async (id, formData) => {
  const res = await axios.put(`${API_URL}/vendedor/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteVendedor = async (id) => {
  const res = await axios.delete(`${API_URL}/vendedor/${id}`);
  return res.data;
};

export const searchVendedores = async (query) => {
  const res = await axios.get(`${API_URL}/vendedor/search?nombre=${query}`);
  return res.data;
};

// ========== REPARTIDORES ==========
export const getRepartidores = async () => {
  const res = await axios.get(`${API_URL}/repartidor`);
  return res.data;
};

export const getRepartidorById = async (id) => {
  const res = await axios.get(`${API_URL}/repartidor/${id}`);
  return res.data;
};

export const createRepartidor = async (formData) => {
  const res = await axios.post(`${API_URL}/repartidor`, formData, {
    headers: { 'Content-Type': 'form-data' }
  });
  return res.data;
};

export const updateRepartidor = async (id, formData) => {
  const res = await axios.put(`${API_URL}/repartidor/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteRepartidor = async (id) => {
  const res = await axios.delete(`${API_URL}/repartidor/${id}`);
  return res.data;
};

export const searchRepartidores = async (query) => {
  const res = await axios.get(`${API_URL}/repartidor/search?nombre=${query}`);
  return res.data;
};