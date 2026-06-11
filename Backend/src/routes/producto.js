import express from "express";
// Importa el upload que ya configuraste en tu archivo de multer
import upload from "../utils/cloudinaryConfig.js"; // Ajusta la ruta según dónde esté tu archivo de upload
import productosController from "../controller/controllerProducto.js";

const router = express.Router();

// Obtener todos los productos
router.get("/", productosController.getAllProductos);

// Buscar productos por nombre (query param: ?nombre=...)
router.get("/search", productosController.searchByNombre);

// Obtener un producto por ID
router.get("/:id", productosController.getProductosById);

// Crear un nuevo producto (con imágenes) – se usa el middleware upload
router.post("/", upload.array("imagenesProductos", 1), productosController.insertProductos);

// Actualizar un producto existente (con imágenes opcionales)
router.put("/:id", upload.array("imagenesProductos", 1), productosController.updateProductos);

// Eliminar un producto
router.delete("/:id", productosController.deleteProductos);

export default router;