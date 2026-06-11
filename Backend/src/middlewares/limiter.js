import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message:
    {
        status: 429,
        error: "Too many requests, please try again later."
    }
});

export default limiter