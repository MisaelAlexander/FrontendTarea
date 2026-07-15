import mongoose, { Schema, model } from "mongoose";

/**
 * Schema de Banner.
 * Representa un banner promocional con imagen de fondo y producto asociado.
 */
const BannerSchema = new Schema({
  // Referencia al producto promocionado en el banner
  idProducto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Productos",
  },
  // URL de la imagen de fondo (Cloudinary)
  FotoFondo: {
    type: String,
  },
  // ID público de la imagen en Cloudinary (para eliminación)
  public_id_FotoFondo: {
    type: String,
  },
}, {
  timestamps: true,
  strict: false,
  collection: "Banner",
});

export default model("Banner", BannerSchema);
