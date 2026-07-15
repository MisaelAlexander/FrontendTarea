import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Comentarios.
 * Representa una reseña/comentario de un cliente sobre un producto.
 */
const ComentariosSchema = new Schema(
  {
    // Título del comentario
    Titulo: {
      type: String,
    },
    // Cuerpo/texto del comentario
    CuerpoComentario: {
      type: String,
    },
    // Calificación del 1 al 5
    Resenia: {
      type: Number,
    },
    // Referencia al cliente que escribió el comentario
    IDCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
    },
    // Referencia al producto comentado
    IDProductos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Productos",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Comentarios", ComentariosSchema);
