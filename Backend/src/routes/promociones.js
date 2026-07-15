import express from "express";
import promocionesController from "../controller/controllerPromociones.js";

/**
 * Rutas de Promociones.
 * Base: /api/promocion
 */
const router = express.Router();

// GET / - Obtener todas las promociones
router.get("/", promocionesController.getAllPromociones);

// GET /:id - Obtener una promoción por ID
router.get("/:id", promocionesController.getPromocionesById);

// POST / - Crear una nueva promoción
router.post("/", promocionesController.insertPromociones);

// PUT /:id - Actualizar una promoción existente
router.put("/:id", promocionesController.updatePromociones);

// DELETE /:id - Eliminar una promoción
router.delete("/:id", promocionesController.deletePromociones);

// POST /search-by-producto - Buscar promociones por nombre del producto
router.post("/search-by-producto", promocionesController.searchByProductoNombre);

export default router;
