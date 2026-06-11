import mongoose, { Schema, model } from "mongoose";

const BannerSchema = new Schema({
  idProducto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Productos",
  },
  FotoFondo: {
    type: String, // URL de Cloudinary
  },
  public_id_FotoFondo: {
    type: String, // para eliminación
  },
}, {
  timestamps: true,
  strict: false,
  collection: "Banner",
});

export default model("Banner", BannerSchema);