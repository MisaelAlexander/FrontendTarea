import express from "express";
import upload from "../utils/cloudinaryConfig.js";
import productosController from "../controller/controllerProducto.js";

/**
 * Rutas de Productos.
 * Base: /api/producto
 */
const router = express.Router();

// GET / - Obtener todos los productos
router.get("/", productosController.getAllProductos);

// GET /search?nombre=... - Buscar productos por nombre
router.get("/search", productosController.searchByNombre);

// GET /category?categoria=... - Obtener productos por categoría
router.get("/category", productosController.getByCategory);

// GET /:id - Obtener un producto por ID
router.get("/:id", productosController.getProductosById);

// POST / - Crear un nuevo producto (con imágenes)
router.post("/", upload.array("imagenesProductos", 1), productosController.insertProductos);

// PUT /:id - Actualizar un producto (con imágenes opcionales)
router.put("/:id", upload.array("imagenesProductos", 1), productosController.updateProductos);

// DELETE /:id - Eliminar un producto
router.delete("/:id", productosController.deleteProductos);

export default router;
