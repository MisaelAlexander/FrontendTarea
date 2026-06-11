import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import {config} from "../../config.js";

// #1 Configuramos cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
})

// #2 Como guardamos las imagenes
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "TechnoMeraki",
        allowed_formats: ["jpg", "png", "jpeg", "pdf", "mp4","webp"]
    }
})

// #3 Configuramos multer
const upload = multer({storage});

// #4 Exportamos la configuracion de multer para usarla en el controlador
export default upload;