import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Promociones.
 * Representa una promoción con descuento aplicado a productos específicos.
 */
const PromocionesSchema = new Schema(
  {
    // Array de productos incluidos en la promoción
    IDproductos: [
      {
        // Referencia al producto
        productos: {
         type: mongoose.Schema.Types.ObjectId,
        ref: "Productos",
        }
      },
    ],
    // Porcentaje de descuento de la promoción
    descuento: {
      type: Number,
    },
    // Fecha de inicio de la promoción
    fechaInicio: {
      type: Date,
    },
    // Fecha de finalización de la promoción
    fechaFinalizacion: {
      type: Date,
    },
  },
  {
    timestamps: true,
    strict: false,
    collection: "Promociones",
  }
);

export default model("Promociones", PromocionesSchema);
