import express from "express";
import wompiController from "../controller/wompiController.js";

/**
 * Rutas de Wompi (cargo directo).
 * Base: /api/wompi
 */
const router = express.Router();

// Flujo completo server-side (recomendado: el frontend nunca ve el token OAuth)
router.post("/cobro", wompiController.cobro);
router.post("/cobro-tokenizado", wompiController.cobroTokenizado);
router.post("/tokenizar", wompiController.tokenizar);

// Token OAuth (depuración / clientes que arman el formData)
router.post("/token", wompiController.generarToken);

// Compatibilidad ProyectoBackend1A ({ token, formData })
router.post("/paymentTest", wompiController.paymentTest);
router.post("/payment3DS", wompiController.payment3DS);

export default router;
