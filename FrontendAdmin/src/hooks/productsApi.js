const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/producto`;

export const getAllProductos = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
};

export const searchProductos = async (nombre) => {
  const res = await fetch(`${API_URL}/search?nombre=${encodeURIComponent(nombre)}`);
  if (!res.ok) throw new Error("Error en la búsqueda");
  return res.json();
};

export const createProducto = async (formData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
};

export const updateProducto = async (id, formData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
};

export const deleteProducto = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.json();
};