import express from "express";
import pedidosController from "../controller/controllerPedido.js";

/**
 * Rutas de Pedidos.
 * Base: /api/pedido
 */
const router = express.Router();

// GET / - Obtener todos los pedidos
router.get("/", pedidosController.getAllPedidos);

// GET /cliente/:clienteId - Obtener pedidos de un cliente específico
router.get("/cliente/:clienteId", pedidosController.getPedidosByCliente);

// GET /:id - Obtener un pedido por ID
router.get("/:id", pedidosController.getPedidosById);

// POST / - Crear un nuevo pedido
router.post("/", pedidosController.insertPedidos);

// PUT /:id - Actualizar un pedido existente
router.put("/:id", pedidosController.updatePedidos);

// DELETE /:id - Eliminar un pedido
router.delete("/:id", pedidosController.deletePedidos);

// POST /search - Buscar pedidos por tipo de pago
router.post("/search", pedidosController.searchByTipoPago);

export default router;
