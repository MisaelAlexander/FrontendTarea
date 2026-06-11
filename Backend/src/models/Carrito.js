import mongoose, { Schema, model } from "mongoose";

const CarritoSchema = new Schema(
  {
    IDCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
    },
    Productos: [
      {
        IDProducto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Productos",
        },
        amount: {
          type: Number,
        },
        subtotal: {
          type: Number,
        },
      },
    ],
    total: {
      type: Number,
    },
    Descuento: {
      type: Number,
    },
    totalConDescuento: {
      type: Number,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Carrito", CarritoSchema);