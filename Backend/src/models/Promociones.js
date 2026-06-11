/*Campos:
IDproductos
{
productos
}
descuento
fechaInicio
fechaFinalizacion
*/

import mongoose, { Schema, model } from "mongoose";

const PromocionesSchema = new Schema(
  {
    IDproductos: [
      {
        productos: {
         type: mongoose.Schema.Types.ObjectId,
        ref: "Productos",
        }
        
      },
    ],
    descuento: {
      type: Number,
    },
    fechaInicio: {
      type: Date,
    },
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