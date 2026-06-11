import express from "express";
import upload from "../utils/cloudinaryConfig.js";
import vendedoresController from "../controller/controllerVendedores.js";

const router = express.Router();

// Middleware que maneja la subida y convierte errores a JSON
const handleUpload = (req, res, next) => {
  const uploadFields = upload.fields([
    { name: "fotoPerfil", maxCount: 1 },
    { name: "imagenesDUI", maxCount: 2 },
  ]);
  uploadFields(req, res, (err) => {
    if (err) {
      // MulterError o cualquier otro error de subida
      return res.status(400).json({ message: err.message || "Error al subir archivos" });
    }
    next();
  });
};

router.get("/", vendedoresController.getVendedores);
router.get("/search", vendedoresController.searchByNombre);
router.get("/:id", vendedoresController.getVendedoresById);
router.post("/", handleUpload, vendedoresController.insertVendedores);
router.put("/:id", handleUpload, vendedoresController.updateVendedores);
router.delete("/:id", vendedoresController.deleteVendedores);

export default router;