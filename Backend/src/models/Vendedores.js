import mongoose, { Schema, model } from "mongoose";

const VendedoresSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    usuario: { type: String, required: true, unique: true, trim: true },
    contraseña: { type: String, required: true },
    sucursal: { type: String, required: true },
    // Array de documentos DUI, cada uno con URL y public_id
    DUI: [
      {
        imagenDUI: { type: String, required: true }, // URL de Cloudinary
        public_id: { type: String, required: true }, // para eliminación
      },
    ],
    fotoPerfil: { type: String }, // URL
    public_id_fotoPerfil: { type: String }, // para eliminación
    salario: { type: Number, required: true, min: 0 }, // <- minúscula para consistencia
  },
  {
    timestamps: true,
    strict: true, // recomendado, ahora el schema cubre todos los campos
    collection: "Vendedores", 
  }
);

export default model("Vendedores", VendedoresSchema);