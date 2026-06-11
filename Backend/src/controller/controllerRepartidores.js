import repartidoresModel from "../models/Repartidores.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const repartidoresController = {};

const eliminarImagenCloudinary = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Error eliminando imagen ${publicId}:`, error);
    }
  }
};

const getMissingFields = (campos, requeridos) => {
  const faltantes = [];
  for (const campo of requeridos) {
    const valor = campos[campo];
    if (valor === undefined || valor === null || valor === "") {
      faltantes.push(campo);
    }
  }
  return faltantes;
};

repartidoresController.getRepartidores = async (req, res) => {
  try {
    const repartidores = await repartidoresModel.find().select("-contraseña");
    res.json(repartidores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

repartidoresController.getRepartidoresById = async (req, res) => {
  try {
    const repartidor = await repartidoresModel.findById(req.params.id).select("-contraseña");
    if (!repartidor) return res.status(404).json({ message: "Repartidor no encontrado" });
    res.json(repartidor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

repartidoresController.insertRepartidores = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { nombre, apellido, usuario, password, sucursal, salario } = req.body;

    const requeridos = ["nombre", "apellido", "usuario", "password", "sucursal", "salario"];
    const faltantes = getMissingFields(req.body, requeridos);
    if (faltantes.length > 0) {
      return res.status(400).json({
        message: `Faltan los siguientes campos obligatorios: ${faltantes.join(", ")}`,
        missingFields: faltantes,
      });
    }

    const existe = await repartidoresModel.findOne({ usuario });
    if (existe) return res.status(400).json({ message: "El nombre de usuario ya está en uso" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let fotoPerfilUrl = "", public_id_foto = "";
    if (req.files?.fotoPerfil?.[0]) {
      fotoPerfilUrl = req.files.fotoPerfil[0].path;
      public_id_foto = req.files.fotoPerfil[0].filename;
    }

    let duiImagenes = [];
    if (req.files?.imagenesDUI?.length) {
      duiImagenes = req.files.imagenesDUI.map(file => ({
        imagenDUI: file.path,
        public_id: file.filename,
      }));
    }

    const nuevoRepartidor = new repartidoresModel({
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

    await nuevoRepartidor.save();
    res.status(201).json({ message: "Repartidor guardado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

repartidoresController.updateRepartidores = async (req, res) => {
  try {
    const { nombre, apellido, usuario, password, sucursal, salario } = req.body;
    const actual = await repartidoresModel.findById(req.params.id);
    if (!actual) return res.status(404).json({ message: "Repartidor no encontrado" });

    const camposAValidar = { nombre, apellido, usuario, sucursal, salario };
    const requeridosEnvio = [];
    for (const [key, value] of Object.entries(camposAValidar)) {
      if (value !== undefined && (value === null || value === "")) {
        requeridosEnvio.push(key);
      }
    }
    if (requeridosEnvio.length > 0) {
      return res.status(400).json({
        message: `Los siguientes campos no pueden estar vacíos: ${requeridosEnvio.join(", ")}`,
        invalidFields: requeridosEnvio,
      });
    }

    if (usuario && usuario !== actual.usuario) {
      const existe = await repartidoresModel.findOne({ usuario });
      if (existe) return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
    }

    let updateData = {
      nombre: nombre || actual.nombre,
      apellido: apellido || actual.apellido,
      usuario: usuario || actual.usuario,
      sucursal: sucursal || actual.sucursal,
      salario: salario ? Number(salario) : actual.salario,
    };

    if (password && password.trim() !== "") {
      updateData.contraseña = await bcrypt.hash(password, 10);
    }

    if (req.files?.fotoPerfil?.[0]) {
      if (actual.public_id_fotoPerfil) await eliminarImagenCloudinary(actual.public_id_fotoPerfil);
      updateData.fotoPerfil = req.files.fotoPerfil[0].path;
      updateData.public_id_fotoPerfil = req.files.fotoPerfil[0].filename;
    }

    if (req.files?.imagenesDUI?.length) {
      for (const dui of actual.DUI) await eliminarImagenCloudinary(dui.public_id);
      updateData.DUI = req.files.imagenesDUI.map(file => ({
        imagenDUI: file.path,
        public_id: file.filename,
      }));
    }

    const updated = await repartidoresModel.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-contraseña");
    res.json({ message: "Repartidor actualizado", repartidor: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

repartidoresController.deleteRepartidores = async (req, res) => {
  try {
    const repartidor = await repartidoresModel.findById(req.params.id);
    if (!repartidor) return res.status(404).json({ message: "Repartidor no encontrado" });
    if (repartidor.public_id_fotoPerfil) await eliminarImagenCloudinary(repartidor.public_id_fotoPerfil);
    for (const dui of repartidor.DUI) await eliminarImagenCloudinary(dui.public_id);
    await repartidoresModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Repartidor eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

repartidoresController.searchByNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) return res.status(400).json({ message: "Debe proporcionar un nombre" });
    const repartidores = await repartidoresModel.find({ nombre: { $regex: nombre, $options: "i" } }).select("-contraseña");
    if (repartidores.length === 0) return res.status(404).json({ message: "No se encontraron repartidores" });
    res.json(repartidores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

export default repartidoresController;