// routes/comentariosRoutes.js
import express from "express";
import comentariosController from "../controller/controllerComentario.js";

const router = express.Router();

// Obtener todos los comentarios
router.get("/", comentariosController.getAllComentarios);

// Obtener un comentario por ID
router.get("/:id", comentariosController.getComentariosById);

// Crear un nuevo comentario
router.post("/", comentariosController.insertComentarios);

// Actualizar un comentario existente
router.put("/:id", comentariosController.updateComentarios);

// Eliminar un comentario
router.delete("/:id", comentariosController.deleteComentarios);

export default router;