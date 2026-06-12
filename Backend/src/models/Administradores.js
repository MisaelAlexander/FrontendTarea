import mongoose, { Schema, model } from "mongoose";

const AdministradoresSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    correo: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 

    },
    usuario: { type: String, required: true, unique: true, trim: true },
    contraseña: { type: String, required: true },
    sucursal: { type: String, required: true },
    DUI: [
      {
        imagenDUI: { type: String, required: true }, // URL de Cloudinary
        public_id: { type: String, required: true }, // para eliminar
      },
    ],
    fotoPerfil: { type: String }, // URL de Cloudinary
    public_id_fotoPerfil: { type: String }, // para eliminar
    salario: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
    strict: true,
    collection: "Administradores", 
  }
);

export default model("Administradores", AdministradoresSchema);