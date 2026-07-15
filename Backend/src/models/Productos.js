import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Productos.
 * Representa los productos vendidos en la tienda.
 */
const ProductosSchema = new Schema(
  {
    // Nombre del producto
    nombre: { type: String, required: true, trim: true },
    // Descripción detallada del producto
    descripcion: { type: String, required: true },
    // Cantidad disponible en inventario
    stock: { type: Number, required: true, min: 0 },
    // Precio unitario en dólares
    precio: { type: Number, required: true, min: 0 },
    // Categoría del producto (ej: Telefonos, Laptops, etc.)
    categoria: { type: String, required: true, trim: true },
    // Sucursal donde se encuentra el producto
    sucursal: { type: String, required: true },
    // Porcentaje de descuento (0-100)
    descuento: { type: Number, default: 0, min: 0, max: 100 },
    // Array de imágenes del producto (URLs de Cloudinary)
    imagenesProductos: [
      {
        imagen: { type: String, required: true },       // URL de la imagen
        public_id: { type: String, required: true },    // ID para eliminar de Cloudinary
      },
    ],
    // Colores disponibles para el producto
    colores: [{ type: String }],
  },
  {
    timestamps: true,
    strict: true,
    collection: "Productos", // Nombre explícito de la colección en MongoDB
  }
);

export default model("Productos", ProductosSchema);
