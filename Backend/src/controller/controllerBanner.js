/**
 * Controller de Banner.
 * Maneja las operaciones CRUD de banners promocionales.
 * Cada banner tiene una imagen de fondo y un producto asociado.
 */
import bannerModel from "../models/Banner.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * Función auxiliar para eliminar imagen de Cloudinary.
 * @param {string} publicId - ID público de la imagen
 */
const eliminarImagenCloudinary = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Error eliminando imagen ${publicId}:`, error);
    }
  }
};

const bannerController = {};

/**
 * GET - Obtener todos los banners.
 * Populate: nombre, precio y descripción del producto asociado.
 */
bannerController.getAllBanners = async (req, res) => {
  try {
    const banners = await bannerModel.find()
      .populate("idProducto", "nombre precio descripcion");
    return res.status(200).json(banners);
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * GET - Obtener un banner por ID.
 * @param {string} req.params.id - ID del banner
 */
bannerController.getBannerById = async (req, res) => {
  try {
    const banner = await bannerModel.findById(req.params.id)
      .populate("idProducto", "nombre precio descripcion");
    if (!banner) {
      return res.status(404).json({ message: "Banner no encontrado" });
    }
    return res.status(200).json(banner);
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * POST - Crear un nuevo banner.
 * Recibe imagen de fondo subida a Cloudinary y ID del producto.
 * @body {string} idProducto - ID del producto asociado
 * @file {File} FotoFondo - Imagen de fondo del banner
 */
bannerController.insertBanner = async (req, res) => {
  try {
    const { idProducto } = req.body;

    let FotoFondoUrl = "";
    let public_id_foto = "";

    if (req.files?.FotoFondo?.[0]) {
      FotoFondoUrl = req.files.FotoFondo[0].path;
      public_id_foto = req.files.FotoFondo[0].filename;
    }

    const newBanner = new bannerModel({
      idProducto,
      FotoFondo: FotoFondoUrl,
      public_id_FotoFondo: public_id_foto,
    });

    await newBanner.save();
    return res.status(201).json({ message: "Banner creado exitosamente" });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * PUT - Actualizar un banner.
 * Elimina la imagen anterior de Cloudinary si se sube una nueva.
 * @param {string} req.params.id - ID del banner
 */
bannerController.updateBanner = async (req, res) => {
  try {
    const { idProducto } = req.body;
    const bannerActual = await bannerModel.findById(req.params.id);
    if (!bannerActual) {
      return res.status(404).json({ message: "Banner no encontrado" });
    }

    let updateData = {};
    if (idProducto) updateData.idProducto = idProducto;

    if (req.files?.FotoFondo?.[0]) {
      // Eliminar imagen anterior de Cloudinary
      if (bannerActual.public_id_FotoFondo) {
        await eliminarImagenCloudinary(bannerActual.public_id_FotoFondo);
      }
      updateData.FotoFondo = req.files.FotoFondo[0].path;
      updateData.public_id_FotoFondo = req.files.FotoFondo[0].filename;
    }

    const updatedBanner = await bannerModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("idProducto", "nombre precio");

    return res.status(200).json({ message: "Banner actualizado", banner: updatedBanner });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * DELETE - Eliminar un banner.
 * Elimina también la imagen de Cloudinary.
 * @param {string} req.params.id - ID del banner
 */
bannerController.deleteBanner = async (req, res) => {
  try {
    const banner = await bannerModel.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner no encontrado" });
    }

    // Eliminar imagen de Cloudinary si existe
    if (banner.public_id_FotoFondo) {
      await eliminarImagenCloudinary(banner.public_id_FotoFondo);
    }

    await bannerModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Banner eliminado correctamente" });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export default bannerController;
