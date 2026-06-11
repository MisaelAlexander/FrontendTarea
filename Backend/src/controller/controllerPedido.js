// Array de funciones
const pedidosController = {};

import pedidosModel from "../models/Pedidos.js";

// SELECT - Obtener todos los pedidos (con populate del carrito)
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

// SELECT BY ID
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

// INSERT
pedidosController.insertPedidos = async (req, res) => {
    try {
        const { idCarrito, tipoPago } = req.body;

        const newPedido = new pedidosModel({
            idCarrito,
            tipoPago
        });

        await newPedido.save();
        return res.status(200).json({ message: "Pedido creado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

// UPDATE
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

// DELETE
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

// Búsqueda por tipo de pago (opcional)
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