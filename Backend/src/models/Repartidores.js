import mongoose, { Schema, model } from "mongoose";

const RepartidoresSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    usuario: { type: String, required: true, unique: true, trim: true },
    contraseña: { type: String, required: true },
    sucursal: { type: String, required: true },
    // Array de documentos DUI con URL y public_id
    DUI: [
      {
        imagenDUI: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    fotoPerfil: { type: String }, // URL
    public_id_fotoPerfil: { type: String }, // para eliminar de Cloudinary
    salario: { type: Number, required: true, min: 0 }, // ← minúscula, requerido
  },
  {
    timestamps: true,
    strict: true, // ahora el schema cubre todos los campos
    collection: "Repartidores", 
  }
);

export default model("Repartidores", RepartidoresSchema);