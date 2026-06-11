import express from "express";
import adminAuthController from "../../controller/Administradores/login.js";

const router = express.Router();

router.route("/login")
  .post(adminAuthController.login);

router.route("/logout")
  .get(adminAuthController.logout); 

export default router;