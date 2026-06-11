// routes/recoveryPasswordClienteRoutes.js
import express from "express";
import recoveryPasswordClienteController from "../../controller/Clientes/recuperarContrasenia.js";

const router = express.Router();

// Paso 1: Solicitar código de recuperación (envía correo)
router.post("/request-code", recoveryPasswordClienteController.requestCode);

// Paso 2: Verificar el código recibido
router.post("/verify-code", recoveryPasswordClienteController.verifyCode);

// Paso 3: Establecer nueva contraseña
router.post("/new-password", recoveryPasswordClienteController.newPassword);

export default router;