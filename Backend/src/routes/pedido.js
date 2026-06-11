// routes/pedidosRoutes.js
import express from "express";
import pedidosController from "../controller/controllerPedido.js";

const router = express.Router();

// Obtener todos los pedidos
router.get("/", pedidosController.getAllPedidos);

// Obtener un pedido por ID
router.get("/:id", pedidosController.getPedidosById);

// Crear un nuevo pedido
router.post("/", pedidosController.insertPedidos);

// Actualizar un pedido existente
router.put("/:id", pedidosController.updatePedidos);

// Eliminar un pedido
router.delete("/:id", pedidosController.deletePedidos);

// Búsqueda por tipo de pago
router.post("/search", pedidosController.searchByTipoPago);

export default router;