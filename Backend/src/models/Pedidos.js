import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Pedidos.
 * Representa un pedido realizado por un cliente.
 */
const PedidosSchema = new Schema(
  {
    // Número secuencial del pedido (auto-incrementable)
    numeroPedido: {
      type: Number,
    },
    // Referencia al carrito asociado al pedido
    idCarrito: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrito",
      required: true,
    },
    // Método de pago utilizado (card, cash, crypto, transfer)
    tipoPago: {
      type: String,
      default: "card",
    },
  },
  {
    timestamps: true,
    strict: false,
    collection: "Pedidos",
  }
);

export default model("Pedidos", PedidosSchema);
