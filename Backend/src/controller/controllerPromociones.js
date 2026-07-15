/**
 * Controller de Promociones.
 * Maneja las operaciones CRUD de promociones con descuentos.
 */
const promocionesController = {};

import promocionesModel from "../models/Promociones.js";
import productosModel from "../models/Productos.js";

/**
 * GET - Obtener todas las promociones.
 * Populate: nombre y precio de los productos incluidos.
 */
promocionesController.getAllPromociones = async (req, res) => {
    try {
        const promociones = await promocionesModel.find()
            .populate("IDproductos.productos", "nombre precio");
        return res.status(200).json(promociones);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * GET - Obtener una promoción por ID.
 * @param {string} req.params.id - ID de la promoción
 */
promocionesController.getPromocionesById = async (req, res) => {
    try {
        const promocion = await promocionesModel.findById(req.params.id)
            .populate("IDproductos.productos", "nombre precio");
        if (!promocion) {
            return res.status(404).json({ message: "Promoción no encontrada" });
        }
        return res.status(200).json(promocion);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * POST - Crear una nueva promoción.
 * @body {Array} IDproductos - Array de IDs de productos
 * @body {number} descuento - Porcentaje de descuento
 * @body {Date} fechaInicio - Fecha de inicio
 * @body {Date} fechaFinalizacion - Fecha de finalización
 */
promocionesController.insertPromociones = async (req, res) => {
    try {
        const { IDproductos, descuento, fechaInicio, fechaFinalizacion } = req.body;

        const newPromocion = new promocionesModel({
            IDproductos,
            descuento,
            fechaInicio,
            fechaFinalizacion
        });

        await newPromocion.save();
        return res.status(200).json({ message: "Promoción creada" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * PUT - Actualizar una promoción existente.
 * @param {string} req.params.id - ID de la promoción
 */
promocionesController.updatePromociones = async (req, res) => {
    try {
        const { IDproductos, descuento, fechaInicio, fechaFinalizacion } = req.body;

        const updatedPromocion = await promocionesModel.findByIdAndUpdate(
            req.params.id,
            {
                IDproductos,
                descuento,
                fechaInicio,
                fechaFinalizacion
            },
            { new: true }
        );

        if (!updatedPromocion) {
            return res.status(404).json({ message: "Promoción no encontrada" });
        }
        return res.status(200).json({ message: "Promoción actualizada" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * DELETE - Eliminar una promoción.
 * @param {string} req.params.id - ID de la promoción
 */
promocionesController.deletePromociones = async (req, res) => {
    try {
        const promocion = await promocionesModel.findByIdAndDelete(req.params.id);
        if (!promocion) {
            return res.status(404).json({ message: "Promoción no encontrada" });
        }
        return res.status(200).json({ message: "Promoción eliminada" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * POST - Buscar promociones por nombre del producto.
 * Busca productos con el nombre dado, luego busca promociones que los incluyan.
 * @body {string} nombre - Nombre del producto a buscar
 */
promocionesController.searchByProductoNombre = async (req, res) => {
    try {
        const { nombre } = req.body;

        // 1. Buscar productos cuyo nombre coincida (parcial, insensible a mayúsculas)
        const productos = await productosModel.find({ nombre: { $regex: nombre, $options: "i" } });
        if (productos.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos con ese nombre" });
        }

        // 2. Obtener los IDs de esos productos
        const productosIds = productos.map(p => p._id);

        // 3. Buscar promociones que tengan al menos uno de esos IDs
        const promociones = await promocionesModel.find({
            "IDproductos.productos": { $in: productosIds }
        }).populate("IDproductos.productos", "nombre precio");

        if (promociones.length === 0) {
            return res.status(404).json({ message: "No hay promociones para los productos buscados" });
        }

        return res.status(200).json(promociones);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export default promocionesController;
