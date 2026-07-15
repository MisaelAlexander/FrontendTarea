/**
 * Controller de Comentarios.
 * Maneja las operaciones CRUD de reseñas/comentarios de productos.
 */
const comentariosController = {};

import comentariosModel from "../models/Comentarios.js";
import productosModel from "../models/Productos.js";

/**
 * GET - Obtener todos los comentarios.
 * Populate: nombre y apellido del cliente, nombre y precio del producto.
 */
comentariosController.getAllComentarios = async (req, res) => {
    try {
        const comentarios = await comentariosModel.find()
            .populate("IDCliente", "nombre apellido")  // trae nombre y apellido del cliente
            .populate("IDProductos", "nombre precio"); // trae nombre y precio del producto
        return res.status(200).json(comentarios);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * GET - Obtener un comentario por ID.
 * @param {string} req.params.id - ID del comentario
 */
comentariosController.getComentariosById = async (req, res) => {
    try {
        const comentario = await comentariosModel.findById(req.params.id)
            .populate("IDCliente", "nombre apellido")
            .populate("IDProductos", "nombre precio");
        if (!comentario) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }
        return res.status(200).json(comentario);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * POST - Crear un nuevo comentario.
 * @body {string} Titulo - Título del comentario
 * @body {string} CuerpoComentario - Texto del comentario
 * @body {number} Resenia - Calificación (1-5)
 * @body {string} IDCliente - ID del cliente que comenta
 * @body {string} IDProductos - ID del producto comentado
 */
comentariosController.insertComentarios = async (req, res) => {
    try {
        const { Titulo, CuerpoComentario, Resenia, IDCliente, IDProductos } = req.body;

        const newComentario = new comentariosModel({
            Titulo,
            CuerpoComentario,
            Resenia,
            IDCliente,
            IDProductos
        });

        await newComentario.save();
        return res.status(200).json({ message: "Comentario creado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * PUT - Actualizar un comentario existente.
 * @param {string} req.params.id - ID del comentario
 */
comentariosController.updateComentarios = async (req, res) => {
    try {
        const { Titulo, CuerpoComentario, Resenia, IDCliente, IDProductos } = req.body;

        const updatedComentario = await comentariosModel.findByIdAndUpdate(
            req.params.id,
            {
                Titulo,
                CuerpoComentario,
                Resenia,
                IDCliente,
                IDProductos
            },
            { new: true }
        );

        if (!updatedComentario) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }
        return res.status(200).json({ message: "Comentario actualizado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * DELETE - Eliminar un comentario.
 * @param {string} req.params.id - ID del comentario
 */
comentariosController.deleteComentarios = async (req, res) => {
    try {
        const comentario = await comentariosModel.findByIdAndDelete(req.params.id);
        if (!comentario) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }
        return res.status(200).json({ message: "Comentario eliminado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export default comentariosController;
