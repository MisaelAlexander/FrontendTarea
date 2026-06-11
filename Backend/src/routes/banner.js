// routes/bannerRoutes.js
import express from "express";
import bannerController from "../controller/controllerBanner.js";

const router = express.Router();

// Obtener todos los banners
router.get("/", bannerController.getAllBanners);

// Obtener un banner por ID
router.get("/:id", bannerController.getBannerById);

// Insertar un nuevo banner
router.post("/", bannerController.insertBanner);

// Actualizar un banner existente
router.put("/:id", bannerController.updateBanner);

// Eliminar un banner
router.delete("/:id", bannerController.deleteBanner);

export default router;