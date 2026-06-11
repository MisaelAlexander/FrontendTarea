// routes/promocionesRoutes.js
import express from "express";
import promocionesController from "../controller/controllerPromociones.js";

const router = express.Router();

// Obtener todas las promociones
router.get("/", promocionesController.getAllPromociones);

// Obtener una promoción por ID
router.get("/:id", promocionesController.getPromocionesById);

// Crear una nueva promoción
router.post("/", promocionesController.insertPromociones);

// Actualizar una promoción existente
router.put("/:id", promocionesController.updatePromociones);

// Eliminar una promoción
router.delete("/:id", promocionesController.deletePromociones);

// Buscar promociones por nombre del producto (body: { nombre })
router.post("/search-by-producto", promocionesController.searchByProductoNombre);

export default router;