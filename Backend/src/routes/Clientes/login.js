// routes/clientesAuthRoutes.js
import express from "express";
import clientesAuthController from "../../controller/Clientes/login.js";

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", clientesAuthController.login);

// Ruta para cerrar sesión
router.post("/logout", clientesAuthController.logout);

// Ruta para verificar sesión activa
router.get("/check-session", clientesAuthController.checkSession);

export default router;