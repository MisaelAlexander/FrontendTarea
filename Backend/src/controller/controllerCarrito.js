/**
 * Controller de Carrito.
 * Maneja las operaciones CRUD del carrito de compras.
 * Calcula subtotales, totales y descuentos automáticamente.
 */
const carritoController = {};

import carritoModel from "../models/Carrito.js";
import productosModel from "../models/Productos.js";

const fail = (status, message) => {
    const e = new Error(message);
    e.status = status;
    throw e;
};

// Valida items, calcula subtotales y controla inventario.
// Lanza error con .status (400/404) si algo no cumple.
const buildProductos = async (Productos) => {
    if (!Array.isArray(Productos) || Productos.length === 0) {
        fail(400, "El carrito debe tener al menos un producto");
    }

    let total = 0;
    const nuevosProductos = [];

    for (const item of Productos) {
        const amount = Number(item.amount);
        if (!Number.isInteger(amount) || amount <= 0) {
            fail(400, "La cantidad debe ser un número entero mayor a cero");
        }

        const productoEncontrado = await productosModel.findById(item.IDProducto);
        if (!productoEncontrado) {
            fail(404, `Producto ${item.IDProducto} no encontrado`);
        }

        if (productoEncontrado.stock < amount) {
            fail(400, `Stock insuficiente para "${productoEncontrado.nombre}". Disponible: ${productoEncontrado.stock}`);
        }

        const subtotal = productoEncontrado.precio * amount;
        total += subtotal;
        nuevosProductos.push({ IDProducto: item.IDProducto, amount, subtotal });
    }

    return { nuevosProductos, total };
};

const sendError = (res, error) => {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.log("Error: " + error);
    return res.status(500).json({ message: "Internal server error", error });
};

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

        // Valida cantidades/stock y calcula subtotales y total
        const { nuevosProductos, total } = await buildProductos(Productos);

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
        return sendError(res, error);
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

        // Recalcular subtotales, total y totalConDescuento (valida cantidades/stock)
        const { nuevosProductos, total } = await buildProductos(Productos);

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
        return sendError(res, error);
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
