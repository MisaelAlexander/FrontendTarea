import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Clientes.
 * Representa a los usuarios/clientes de la tienda.
 */
const ClientesSchema = new Schema(
  {
    // Nombre del cliente
    nombre: { type: String, required: true, trim: true },
    // Apellido del cliente
    apellido: { type: String, required: true, trim: true },
    // Nombre de usuario único para login
    usuario: { type: String, required: true, unique: true, trim: true },
    // Contraseña hasheada con bcrypt
    contraseña: { type: String, required: true },
    // Correo electrónico único y válido
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Correo inválido"],
    },
    // Array de IDs de productos favoritos (referencia a Productos)
    Favoritos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Productos",
      },
    ],
    // Indica si el cliente verificó su correo electrónico
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
    strict: true,     // Solo permite guardar campos definidos en el schema
  }
);

export default model("Clientes", ClientesSchema);
