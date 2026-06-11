import mongoose, { Schema, model } from "mongoose";

const BannerSchema = new Schema(
  {
    idProducto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Productos",
    },
    FotoFondo: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Banner", BannerSchema);