import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Administradores.
 * Representa a los administradores del sistema.
 */
const AdministradoresSchema = new Schema(
  {
    // Nombre del administrador
    nombre: { type: String, required: true, trim: true },
    // Apellido del administrador
    apellido: { type: String, required: true, trim: true },
    // Correo electrónico único
    correo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Nombre de usuario único para login
    usuario: { type: String, required: true, unique: true, trim: true },
    // Contraseña hasheada con bcrypt
    contraseña: { type: String, required: true },
    // Sucursal donde trabaja
    sucursal: { type: String, required: true },
    // Documento DUI del administrador (imagen en Cloudinary)
    DUI: [
      {
        imagenDUI: { type: String, required: true }, // URL de Cloudinary
        public_id: { type: String, required: true }, // ID para eliminar
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
    collection: "Administradores",
  }
);

export default model("Administradores", AdministradoresSchema);
