import express from "express";
import comentariosController from "../controller/controllerComentario.js";

/**
 * Rutas de Comentarios.
 * Base: /api/comentario
 */
const router = express.Router();

// GET / - Obtener todos los comentarios
router.get("/", comentariosController.getAllComentarios);

// GET /:id - Obtener un comentario por ID
router.get("/:id", comentariosController.getComentariosById);

// POST / - Crear un nuevo comentario
router.post("/", comentariosController.insertComentarios);

// PUT /:id - Actualizar un comentario existente
router.put("/:id", comentariosController.updateComentarios);

// DELETE /:id - Eliminar un comentario
router.delete("/:id", comentariosController.deleteComentarios);

export default router;
