// routes/carritoRoutes.js
import express from "express";
import carritoController from "../controller/controllerCarrito.js";

const router = express.Router();

// Obtener todos los carritos
router.get("/", carritoController.getAllCarritos);

// Obtener un carrito por ID
router.get("/:id", carritoController.getCarritoById);

// Crear un nuevo carrito
router.post("/", carritoController.insertCarrito);

// Actualizar un carrito existente
router.put("/:id", carritoController.updateCarrito);

// Eliminar un carrito
router.delete("/:id", carritoController.deleteCarrito);

export default router;