/**
 * Controller de Carrito.
 * Maneja las operaciones CRUD del carrito de compras.
 * Calcula subtotales, totales y descuentos automáticamente.
 */
const carritoController = {};

import carritoModel from "../models/Carrito.js";
import productosModel from "../models/Productos.js";

/**
 * GET - Obtener todos los carritos.
 * Populate: cliente (nombre, email) y productos (nombre, precio, imágenes, stock, descuento).
 */
carritoController.getAllCarritos = async (req, res) => {
    try {
        const carritos = await carritoModel.find()
            .populate("IDCliente", "nombre email")
            .populate("Productos.IDProducto", "nombre precio imagenesProductos stock descuento");
        return res.status(200).json(carritos);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * GET - Obtener un carrito por ID.
 * @param {string} req.params.id - ID del carrito
 */
carritoController.getCarritoById = async (req, res) => {
    try {
        const carrito = await carritoModel.findById(req.params.id)
            .populate("IDCliente", "nombre email")
            .populate("Productos.IDProducto", "nombre precio imagenesProductos stock descuento");
        if (!carrito) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        return res.status(200).json(carrito);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * POST - Crear un nuevo carrito.
 * Calcula automáticamente los subtotales y totales basándose en los precios de la BD.
 * @body {string} IDCliente - ID del cliente propietario
 * @body {Array} Productos - Array de { IDProducto, amount }
 * @body {number} [Descuento] - Porcentaje de descuento (opcional)
 */
carritoController.insertCarrito = async (req, res) => {
    try {
        const { IDCliente, Productos, Descuento } = req.body;

        // Calcular subtotales, total y totalConDescuento
        let total = 0;
        let nuevosProductos = [];

        for (let i = 0; i < Productos.length; i++) {
            // Buscar el producto en la base de datos para obtener su precio
            const productoEncontrado = await productosModel.findById(Productos[i].IDProducto);
            if (!productoEncontrado) {
                return res.status(404).json({ message: `Producto ${Productos[i].IDProducto} no encontrado` });
            }

            // Calcular subtotal para este producto (precio × cantidad)
            const subtotal = productoEncontrado.precio * Productos[i].amount;
            total += subtotal;

            nuevosProductos.push({
                IDProducto: Productos[i].IDProducto,
                monto: Productos[i].amount,
                subtotal: subtotal
            });
        }

        // Calcular total con descuento (si hay descuento)
        let totalConDescuento = total;
        if (Descuento && Descuento > 0) {
            totalConDescuento = total - (total * (Descuento / 100));
        }

        const nuevoCarrito = new carritoModel({
            IDCliente,
            Productos: nuevosProductos,
            total,
            Descuento: Descuento || 0,
            totalConDescuento
        });

        await nuevoCarrito.save();
        return res.status(200).json({ message: "Carrito creado", carrito: nuevoCarrito });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * PUT - Actualizar un carrito existente.
 * Recalcula todos los subtotales y totales.
 * @param {string} req.params.id - ID del carrito
 */
carritoController.updateCarrito = async (req, res) => {
    try {
        const { IDCliente, Productos, Descuento } = req.body;

        // Recalcular subtotales, total y totalConDescuento
        let total = 0;
        let nuevosProductos = [];

        for (let i = 0; i < Productos.length; i++) {
            const productoEncontrado = await productosModel.findById(Productos[i].IDProducto);
            if (!productoEncontrado) {
                return res.status(404).json({ message: `Producto ${Productos[i].IDProducto} no encontrado` });
            }

            const subtotal = productoEncontrado.precio * Productos[i].amount;
            total += subtotal;

            nuevosProductos.push({
                IDProducto: Productos[i].IDProducto,
                amount: Productos[i].amount,
                subtotal: subtotal
            });
        }

        let totalConDescuento = total;
        if (Descuento && Descuento > 0) {
            totalConDescuento = total - (total * (Descuento / 100));
        }

        const carritoActualizado = await carritoModel.findByIdAndUpdate(
            req.params.id,
            {
                IDCliente,
                Productos: nuevosProductos,
                total,
                Descuento: Descuento || 0,
                totalConDescuento
            },
            { new: true }
        );

        if (!carritoActualizado) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        return res.status(200).json({ message: "Carrito actualizado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * DELETE - Eliminar un carrito.
 * @param {string} req.params.id - ID del carrito
 */
carritoController.deleteCarrito = async (req, res) => {
    try {
        const carrito = await carritoModel.findByIdAndDelete(req.params.id);
        if (!carrito) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        return res.status(200).json({ message: "Carrito eliminado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export default carritoController;
