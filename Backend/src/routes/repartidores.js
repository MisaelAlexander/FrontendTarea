import express from "express";
import upload from "../utils/cloudinaryConfig.js";
import repartidoresController from "../controller/controllerRepartidores.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "fotoPerfil", maxCount: 1 },
  { name: "imagenesDUI", maxCount: 5 },
]);

router.get("/", repartidoresController.getRepartidores);
router.get("/search", repartidoresController.searchByNombre);
router.get("/:id", repartidoresController.getRepartidoresById);
router.post("/", uploadFields, repartidoresController.insertRepartidores);
router.put("/:id", uploadFields, repartidoresController.updateRepartidores);
router.delete("/:id", repartidoresController.deleteRepartidores);

export default router;