import express from "express";
import recoveryPasswordAdminController from "../../controller/Administradores/recuperarContrasenia.js";

const router = express.Router();

router.route("/request-code")
  .post(recoveryPasswordAdminController.requestCode);

router.route("/verify-code")
  .post(recoveryPasswordAdminController.verifyCode);

router.route("/new-password")
  .post(recoveryPasswordAdminController.newPassword);

export default router;