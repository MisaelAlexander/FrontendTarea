import express from "express";
import clientesCrudController from "../../controller/Clientes/clientes.js";

const router = express.Router();

router.route("/")
  .get(clientesCrudController.getAllClientes);

router.route("/buscar")
  .get(clientesCrudController.searchByNombre);

router.route("/:id")
  .get(clientesCrudController.getClientesById)
  .put(clientesCrudController.updateCliente)
  .delete(clientesCrudController.deleteCliente);

export default router;