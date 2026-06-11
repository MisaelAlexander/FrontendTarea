import administradoresModel from "../../models/Administradores.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const administradoresController = {};

// Helper para eliminar imágenes de Cloudinary
const eliminarImagenCloudinary = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Error eliminando imagen ${publicId}:`, error);
    }
  }
};

// GET - Obtener todos los administradores (sin contraseña)
administradoresController.getAllAdministradores = async (req, res) => {
  try {
    const administradores = await administradoresModel.find().select("-contraseña");
    res.status(200).json(administradores);
  } catch (error) {
    console.error("Error al obtener administradores:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener administrador por ID (sin contraseña)
administradoresController.getAdministradoresById = async (req, res) => {
  try {
    const administrador = await administradoresModel.findById(req.params.id).select("-contraseña");
    if (!administrador) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    res.status(200).json(administrador);
  } catch (error) {
    console.error("Error al obtener administrador por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST - Crear administrador (con imágenes subidas a Cloudinary)
administradoresController.insertAdministradores = async (req, res) => {
  try {
    const { nombre, apellido, usuario, contraseña, sucursal, salario } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !usuario || !contraseña || !sucursal || !salario) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar unicidad de usuario
    const existe = await administradoresModel.findOne({ usuario });
    if (existe) {
      return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Procesar foto de perfil
    let fotoPerfilUrl = "";
    let public_id_foto = "";
    if (req.files?.fotoPerfil?.[0]) {
      fotoPerfilUrl = req.files.fotoPerfil[0].path;
      public_id_foto = req.files.fotoPerfil[0].filename;
    }

    // Procesar imágenes del DUI (campo "imagenesDUI")
    let duiImagenes = [];
    if (req.files?.imagenesDUI?.length) {
      duiImagenes = req.files.imagenesDUI.map(file => ({
        imagenDUI: file.path,
        public_id: file.filename,
      }));
    }

    const newAdmin = new administradoresModel({
      nombre,
      apellido,
      usuario,
      contraseña: hashedPassword,
      sucursal,
      DUI: duiImagenes,
      fotoPerfil: fotoPerfilUrl,
      public_id_fotoPerfil: public_id_foto,
      salario: Number(salario),
    });

    await newAdmin.save();
    res.status(201).json({ message: "Administrador creado exitosamente" });
  } catch (error) {
    console.error("Error al insertar administrador:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT - Actualizar administrador (con eliminación de imágenes viejas)
administradoresController.updateAdministradores = async (req, res) => {
  try {
    const { nombre, apellido, usuario, contraseña, sucursal, salario } = req.body;
    const adminActual = await administradoresModel.findById(req.params.id);
    if (!adminActual) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    // Verificar unicidad de usuario si cambia
    if (usuario && usuario !== adminActual.usuario) {
      const existe = await administradoresModel.findOne({ usuario });
      if (existe) {
        return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
      }
    }

    let updateData = {
      nombre: nombre || adminActual.nombre,
      apellido: apellido || adminActual.apellido,
      usuario: usuario || adminActual.usuario,
      sucursal: sucursal || adminActual.sucursal,
      salario: salario ? Number(salario) : adminActual.salario,
    };

    // Actualizar contraseña si se envía
    if (contraseña && contraseña.trim() !== "") {
      updateData.contraseña = await bcrypt.hash(contraseña, 10);
    }

    // Actualizar foto de perfil
    if (req.files?.fotoPerfil?.[0]) {
      if (adminActual.public_id_fotoPerfil) {
        await eliminarImagenCloudinary(adminActual.public_id_fotoPerfil);
      }
      updateData.fotoPerfil = req.files.fotoPerfil[0].path;
      updateData.public_id_fotoPerfil = req.files.fotoPerfil[0].filename;
    }

    // Actualizar imágenes DUI (reemplazo completo)
    if (req.files?.imagenesDUI?.length) {
      // Eliminar las anteriores
      for (const dui of adminActual.DUI) {
        await eliminarImagenCloudinary(dui.public_id);
      }
      updateData.DUI = req.files.imagenesDUI.map(file => ({
        imagenDUI: file.path,
        public_id: file.filename,
      }));
    } else {
      // Mantener las existentes si no se suben nuevas
      updateData.DUI = adminActual.DUI;
    }

    const updatedAdmin = await administradoresModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-contraseña");

    res.status(200).json({ message: "Administrador actualizado", administrador: updatedAdmin });
  } catch (error) {
    console.error("Error al actualizar administrador:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE - Eliminar administrador (y sus imágenes de Cloudinary)
administradoresController.deleteAdministradores = async (req, res) => {
  try {
    const administrador = await administradoresModel.findById(req.params.id);
    if (!administrador) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    // Eliminar foto de perfil
    if (administrador.public_id_fotoPerfil) {
      await eliminarImagenCloudinary(administrador.public_id_fotoPerfil);
    }

    // Eliminar cada imagen DUI
    for (const dui of administrador.DUI) {
      await eliminarImagenCloudinary(dui.public_id);
    }

    await administradoresModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Administrador eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar administrador:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Búsqueda por nombre (query param)
administradoresController.searchByNombre = async (req, res) => {
  try {
    const { nombre } = req.query; // ← importante: usar query, no body
    if (!nombre) {
      return res.status(400).json({ message: "Debe proporcionar un nombre para buscar" });
    }
    const administradores = await administradoresModel
      .find({ nombre: { $regex: nombre, $options: "i" } })
      .select("-contraseña");
    if (administradores.length === 0) {
      return res.status(404).json({ message: "No se encontraron administradores con ese nombre" });
    }
    res.status(200).json(administradores);
  } catch (error) {
    console.error("Error en búsqueda por nombre:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default administradoresController;