import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const getBanners = async () => {
  const res = await axios.get(`${API_URL}/banner`);
  return res.data;
};

export const createBanner = async (bannerData) => {
  const res = await axios.post(`${API_URL}/banner`, bannerData);
  return res.data;
};

export const updateBanner = async (id, bannerData) => {
  const res = await axios.put(`${API_URL}/banner/${id}`, bannerData);
  return res.data;
};

export const deleteBanner = async (id) => {
  const res = await axios.delete(`${API_URL}/banner/${id}`);
  return res.data;
};