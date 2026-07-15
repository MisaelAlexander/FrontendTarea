import rateLimit from "express-rate-limit";

/**
 * Middleware de rate limiting.
 * Limita las solicitudes por IP para prevenir abusos.
 * Ventana: 1 minuto, máximo 100 solicitudes por ventana.
 */
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // Ventana de 1 minuto
    max: 100, // Máximo 100 solicitudes por ventana por IP
    message: {
        status: 429,
        error: "Too many requests, please try again later."
    }
});

export default limiter;
