import express from "express";
import administradoresController from "../../controller/Administradores/administradores.js";
import upload from "../../utils/cloudinaryConfig.js"; // Ajusta la ruta según tu estructura

const router = express.Router();

// Configuración de campos para multer
const uploadFields = upload.fields([
  { name: "fotoPerfil", maxCount: 1 },
  { name: "imagenesDUI", maxCount: 5 }, // máximo 5 imágenes del DUI
]);

router.route("/")
  .get(administradoresController.getAllAdministradores)
  .post(uploadFields, administradoresController.insertAdministradores);

router.route("/buscar")
  .get(administradoresController.searchByNombre);

router.route("/:id")
  .get(administradoresController.getAdministradoresById)
  .put(uploadFields, administradoresController.updateAdministradores)
  .delete(administradoresController.deleteAdministradores);

export default router;