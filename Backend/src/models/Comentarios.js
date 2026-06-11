import mongoose, { Schema, model } from "mongoose";

const ComentariosSchema = new Schema(
  {
    Titulo: {
      type: String,
    },
    CuerpoComentario: {
      type: String,
    },
    Resenia: {
      type: Number,
    },
    IDCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
    },
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