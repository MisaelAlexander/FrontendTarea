import mongoose, { Schema, model } from "mongoose";

const PedidosSchema = new Schema(
  {
    idCarrito: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrito",
    },
    tipoPago: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Pedidos", PedidosSchema);