import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Vendedores.
 * Representa a los vendedores de la tienda.
 */
const VendedoresSchema = new Schema(
  {
    // Nombre del vendedor
    nombre: { type: String, required: true, trim: true },
    // Apellido del vendedor
    apellido: { type: String, required: true, trim: true },
    // Nombre de usuario único para login
    usuario: { type: String, required: true, unique: true, trim: true },
    // Contraseña hasheada con bcrypt
    contraseña: { type: String, required: true },
    // Sucursal donde trabaja
    sucursal: { type: String, required: true },
    // Documento DUI del vendedor (imagen en Cloudinary)
    DUI: [
      {
        imagenDUI: { type: String, required: true }, // URL de Cloudinary
        public_id: { type: String, required: true }, // ID para eliminación
      },
    ],
    // Foto de perfil (URL de Cloudinary)
    fotoPerfil: { type: String },
    // ID de la foto de perfil en Cloudinary
    public_id_fotoPerfil: { type: String },
    // Salario mensual
    salario: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
    strict: true,
    collection: "Vendedores",
  }
);

export default model("Vendedores", VendedoresSchema);
