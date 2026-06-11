import mongoose, { Schema, model } from "mongoose";

const ClientesSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    usuario: { type: String, required: true, unique: true, trim: true },
    contraseña: { type: String, required: true },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Correo inválido"],
    },
    Favoritos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Productos",
      },
    ],
    isVerified: { type: Boolean, default: false }, // solo este campo adicional
    // loginAttempts, timeOut opcionales si se quieren implementar después
  },
  {
    timestamps: true,
    strict: true,
  }
);

export default model("Clientes", ClientesSchema);