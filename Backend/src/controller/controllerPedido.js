/**
 * Controller de Pedidos.
 * Maneja las operaciones CRUD de pedidos.
 * Cada pedido tiene un número secuencial y referencia un carrito.
 */
const pedidosController = {};

import pedidosModel from "../models/Pedidos.js";
import carritosModel from "../models/Carrito.js";

/**
 * GET - Obtener todos los pedidos.
 * Populate: carrito completo con productos detallados.
 */
pedidosController.getAllPedidos = async (req, res) => {
    try {
        const pedidos = await pedidosModel.find()
            .populate("idCarrito"); // Trae todos los datos del carrito referenciado
        return res.status(200).json(pedidos);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * GET - Obtener pedidos de un cliente específico.
 * Primero busca los carritos del cliente, luego los pedidos que los referencian.
 * @param {string} req.params.clienteId - ID del cliente
 */
pedidosController.getPedidosByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;

        // 1. Encontrar todos los carritos del cliente
        const carritos = await carritosModel.find({ IDCliente: clienteId }).select("_id");
        const carritoIds = carritos.map(c => c._id);

        // 2. Encontrar pedidos que referencien esos carritos
        const pedidos = await pedidosModel.find({ idCarrito: { $in: carritoIds } })
            .populate({
                path: "idCarrito",
                populate: { path: "Productos.IDProducto", select: "nombre precio imagenesProductos" }
            })
            .sort({ createdAt: -1 }); // Ordenar del más reciente al más antiguo

        return res.status(200).json(pedidos);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * GET - Obtener un pedido por ID.
 * @param {string} req.params.id - ID del pedido
 */
pedidosController.getPedidosById = async (req, res) => {
    try {
        const pedido = await pedidosModel.findById(req.params.id)
            .populate("idCarrito");
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        return res.status(200).json(pedido);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * POST - Crear un nuevo pedido.
 * Genera automáticamente un número de pedido secuencial.
 * @body {string} idCarrito - ID del carrito asociado
 * @body {string} [tipoPago] - Método de pago (default: "card")
 */
pedidosController.insertPedidos = async (req, res) => {
    try {
        const { idCarrito, tipoPago } = req.body;

        if (!idCarrito) {
            return res.status(400).json({ message: "Se requiere idCarrito" });
        }

        // Obtener el último número de pedido para generar el siguiente
        const lastPedido = await pedidosModel.findOne({ numeroPedido: { $exists: true, $ne: null } }).sort({ numeroPedido: -1 });
        const nextNumber = lastPedido ? (lastPedido.numeroPedido || 0) + 1 : 1;

        const newPedido = new pedidosModel({
            numeroPedido: nextNumber,
            idCarrito,
            tipoPago: tipoPago || "card"
        });

        await newPedido.save();
        return res.status(200).json({ message: "Pedido creado", numeroPedido: nextNumber, pedido: newPedido });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

/**
 * PUT - Actualizar un pedido existente.
 * @param {string} req.params.id - ID del pedido
 */
pedidosController.updatePedidos = async (req, res) => {
    try {
        const { idCarrito, tipoPago } = req.body;

        const updatedPedido = await pedidosModel.findByIdAndUpdate(
            req.params.id,
            {
                idCarrito,
                tipoPago
            },
            { new: true }
        );

        if (!updatedPedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        return res.status(200).json({ message: "Pedido actualizado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * DELETE - Eliminar un pedido.
 * @param {string} req.params.id - ID del pedido
 */
pedidosController.deletePedidos = async (req, res) => {
    try {
        const pedido = await pedidosModel.findByIdAndDelete(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        return res.status(200).json({ message: "Pedido eliminado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

/**
 * POST - Búsqueda por tipo de pago.
 * @body {string} tipoPago - Tipo de pago a buscar
 */
pedidosController.searchByTipoPago = async (req, res) => {
    try {
        const { tipoPago } = req.body;
        const pedidos = await pedidosModel.find({ tipoPago: { $regex: tipoPago, $options: "i" } })
            .populate("idCarrito");
        if (pedidos.length === 0) {
            return res.status(404).json({ message: "No se encontraron pedidos con ese tipo de pago" });
        }
        return res.status(200).json(pedidos);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export default pedidosController;
