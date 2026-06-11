// Array de funciones
const bannerController = {};

import bannerModel from "../models/Banner.js";

// SELECT - Obtener todos los banners (con populate del producto)
bannerController.getAllBanners = async (req, res) => {
    try {
        const banners = await bannerModel.find()
            .populate("idProducto", "nombre precio"); // Trae nombre y precio del producto
        return res.status(200).json(banners);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

// SELECT BY ID
bannerController.getBannerById = async (req, res) => {
    try {
        const banner = await bannerModel.findById(req.params.id)
            .populate("idProducto", "nombre precio");
        if (!banner) {
            return res.status(404).json({ message: "Banner no encontrado" });
        }
        return res.status(200).json(banner);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

// INSERT
bannerController.insertBanner = async (req, res) => {
    try {
        const { idProducto, FotoFondo } = req.body;

        const newBanner = new bannerModel({
            idProducto,
            FotoFondo
        });

        await newBanner.save();
        return res.status(200).json({ message: "Banner creado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

// UPDATE
bannerController.updateBanner = async (req, res) => {
    try {
        const { idProducto, FotoFondo } = req.body;

        const updatedBanner = await bannerModel.findByIdAndUpdate(
            req.params.id,
            {
                idProducto,
                FotoFondo
            },
            { new: true }
        );

        if (!updatedBanner) {
            return res.status(404).json({ message: "Banner no encontrado" });
        }
        return res.status(200).json({ message: "Banner actualizado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

// DELETE
bannerController.deleteBanner = async (req, res) => {
    try {
        const banner = await bannerModel.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: "Banner no encontrado" });
        }
        return res.status(200).json({ message: "Banner eliminado" });
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export default bannerController;