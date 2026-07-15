import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Repartidores.
 * Representa a los repartidores de la tienda.
 */
const RepartidoresSchema = new Schema(
  {
    // Nombre del repartidor
    nombre: { type: String, required: true, trim: true },
    // Apellido del repartidor
    apellido: { type: String, required: true, trim: true },
    // Nombre de usuario único para login
    usuario: { type: String, required: true, unique: true, trim: true },
    // Contraseña hasheada con bcrypt
    contraseña: { type: String, required: true },
    // Sucursal donde trabaja
    sucursal: { type: String, required: true },
    // Documento DUI del repartidor (imagen en Cloudinary)
    DUI: [
      {
        imagenDUI: { type: String, required: true },
        public_id: { type: String, required: true },
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
    collection: "Repartidores",
  }
);

export default model("Repartidores", RepartidoresSchema);
