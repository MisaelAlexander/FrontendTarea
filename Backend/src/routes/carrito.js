import express from "express";
import carritoController from "../controller/controllerCarrito.js";

/**
 * Rutas de Carrito.
 * Base: /api/carrito
 */
const router = express.Router();

// GET / - Obtener todos los carritos
router.get("/", carritoController.getAllCarritos);

// GET /:id - Obtener un carrito por ID
router.get("/:id", carritoController.getCarritoById);

// POST / - Crear un nuevo carrito
router.post("/", carritoController.insertCarrito);

// PUT /:id - Actualizar un carrito existente
router.put("/:id", carritoController.updateCarrito);

// DELETE /:id - Eliminar un carrito
router.delete("/:id", carritoController.deleteCarrito);

export default router;
