import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import {config} from "../../config.js";

/**
 * Configuración de Cloudinary y Multer para subida de imágenes.
 * Las imágenes se suben automáticamente a Cloudinary en la carpeta "TechnoMeraki".
 */

// Paso 1: Configurar Cloudinary con las credenciales del .env
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
})

// Paso 2: Configurar el almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "TechnoMeraki", // Carpeta donde se guardan las imágenes
        allowed_formats: ["jpg", "png", "jpeg", "pdf", "mp4","webp"] // Formatos permitidos
    }
})

// Paso 3: Configurar Multer con el almacenamiento de Cloudinary
const upload = multer({storage});

// Paso 4: Exportar la configuración de Multer para usarla en las rutas
export default upload;
