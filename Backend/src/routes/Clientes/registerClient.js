// routes/registerClientRoutes.js
import express from "express";
import registerClient from "../../controller/Clientes/registerClient.js";

const router = express.Router();

// Paso 1: Iniciar registro (envía código al correo)
router.post("/register", registerClient.register);

// Paso 2: Verificar código y crear cuenta en BD
router.post("/verify-code", registerClient.verifyCode);

export default router;