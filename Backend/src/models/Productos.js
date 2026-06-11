import mongoose, { Schema, model } from "mongoose";

const ProductosSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    precio: { type: Number, required: true, min: 0 },
    sucursal: { type: String, required: true },
    descuento: { type: Number, default: 0, min: 0, max: 100 },
    imagenesProductos: [
      {
        imagen: { type: String, required: true }, // URL de Cloudinary
        public_id: { type: String, required: true }, // para eliminar
      },
    ],
    colores: [{ type: String }], // simplificado: array de strings
  },
  {
    timestamps: true,
    strict: true,
    collection: "Productos", 
  }
);

export default model("Productos", ProductosSchema);