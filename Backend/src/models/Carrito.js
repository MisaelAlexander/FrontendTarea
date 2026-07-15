import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Carrito.
 * Representa el carrito de compras de un cliente.
 */
const CarritoSchema = new Schema(
  {
    // Referencia al cliente propietario del carrito
    IDCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
    },
    // Array de productos en el carrito
    Productos: [
      {
        // Referencia al producto
        IDProducto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Productos",
        },
        // Cantidad del producto
        amount: {
          type: Number,
        },
        // Subtotal (precio × cantidad)
        subtotal: {
          type: Number,
        },
      },
    ],
    // Total del carrito sin descuento
    total: {
      type: Number,
    },
    // Porcentaje de descuento aplicado
    Descuento: {
      type: Number,
    },
    // Total con descuento aplicado
    totalConDescuento: {
      type: Number,
    },
  },
  {
    timestamps: true,
    strict: false, // Permite campos adicionales no definidos
    collection: "Carrito",
  }
);

export default model("Carrito", CarritoSchema);
