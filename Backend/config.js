import dotenv from "dotenv"

//Ejecutamos la libreria dotenv
dotenv.config()

export const config = {
    db:{
        URI: process.env.DB_URI
    },
    JWT:{
        secret: process.env.JWT_Secret_key
        
    },
    email:{
        user_email: process.env.USER_EMAIL,
        user_password: process.env.USER_PASSWORD
    },
    cloudinary:{
        cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
    },
    wompi:{
        // Acepta ambos formatos de .env (con o sin prefijo WOMPI_)
        grant_type: process.env.GRANT_TYPE || process.env.WOMPI_GRANT_TYPE || "client_credentials",
        audience: process.env.AUDIENCE || process.env.WOMPI_AUDIENCE || "wompi_api",
        client_id: process.env.CLIENT_ID || process.env.WOMPI_CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET || process.env.WOMPI_CLIENT_SECRET
    }
}