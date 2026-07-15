import express from "express";
import upload from "../utils/cloudinaryConfig.js";
import bannerController from "../controller/controllerBanner.js";

/**
 * Rutas de Banner.
 * Base: /api/banner
 */
const router = express.Router();

// Configuración de multer para campo FotoFondo (1 imagen)
const uploadFields = upload.fields([
  { name: "FotoFondo", maxCount: 1 },
]);

// GET / - Obtener todos los banners
router.get("/", bannerController.getAllBanners);

// GET /:id - Obtener un banner por ID
router.get("/:id", bannerController.getBannerById);

// POST / - Crear un nuevo banner (con imagen)
router.post("/", uploadFields, bannerController.insertBanner);

// PUT /:id - Actualizar un banner (con imagen opcional)
router.put("/:id", uploadFields, bannerController.updateBanner);

// DELETE /:id - Eliminar un banner
router.delete("/:id", bannerController.deleteBanner);

export default router;
