import vendedoresModel from "../models/Vendedores.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const vendedoresController = {};

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

// GET - todos
vendedoresController.getVendedores = async (req, res) => {
  try {
    const vendedores = await vendedoresModel.find().select("-contraseña");
    res.json(vendedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

// GET - por ID
vendedoresController.getVendedoresById = async (req, res) => {
  try {
    const vendedor = await vendedoresModel.findById(req.params.id).select("-contraseña");
    if (!vendedor) return res.status(404).json({ message: "Vendedor no encontrado" });
    res.json(vendedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

// POST - crear (usa 'password' en req.body)
vendedoresController.insertVendedores = async (req, res) => {
  try {
    console.log(" req.body:", req.body);
    const { nombre, apellido, usuario, password, sucursal, salario } = req.body;

    const requeridos = ["nombre", "apellido", "usuario", "password", "sucursal", "salario"];
    const faltantes = getMissingFields(req.body, requeridos);
    if (faltantes.length > 0) {
      return res.status(400).json({
        message: `Faltan los siguientes campos obligatorios: ${faltantes.join(", ")}`,
        missingFields: faltantes,
      });
    }

    const existe = await vendedoresModel.findOne({ usuario });
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

    const nuevoVendedor = new vendedoresModel({
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

    await nuevoVendedor.save();
    res.status(201).json({ message: "Vendedor guardado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

// PUT - actualizar (usa 'password' opcional)
vendedoresController.updateVendedores = async (req, res) => {
  try {
    const { nombre, apellido, usuario, password, sucursal, salario } = req.body;
    const vendedorActual = await vendedoresModel.findById(req.params.id);
    if (!vendedorActual) return res.status(404).json({ message: "Vendedor no encontrado" });

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

    if (usuario && usuario !== vendedorActual.usuario) {
      const existe = await vendedoresModel.findOne({ usuario });
      if (existe) return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
    }

    let updateData = {
      nombre: nombre || vendedorActual.nombre,
      apellido: apellido || vendedorActual.apellido,
      usuario: usuario || vendedorActual.usuario,
      sucursal: sucursal || vendedorActual.sucursal,
      salario: salario ? Number(salario) : vendedorActual.salario,
    };

    if (password && password.trim() !== "") {
      updateData.contraseña = await bcrypt.hash(password, 10);
    }

    if (req.files?.fotoPerfil?.[0]) {
      if (vendedorActual.public_id_fotoPerfil) await eliminarImagenCloudinary(vendedorActual.public_id_fotoPerfil);
      updateData.fotoPerfil = req.files.fotoPerfil[0].path;
      updateData.public_id_fotoPerfil = req.files.fotoPerfil[0].filename;
    }

    if (req.files?.imagenesDUI?.length) {
      for (const dui of vendedorActual.DUI) await eliminarImagenCloudinary(dui.public_id);
      updateData.DUI = req.files.imagenesDUI.map(file => ({
        imagenDUI: file.path,
        public_id: file.filename,
      }));
    }

    const updated = await vendedoresModel.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-contraseña");
    res.json({ message: "Vendedor actualizado", vendedor: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

// DELETE
vendedoresController.deleteVendedores = async (req, res) => {
  try {
    const vendedor = await vendedoresModel.findById(req.params.id);
    if (!vendedor) return res.status(404).json({ message: "Vendedor no encontrado" });

    if (vendedor.public_id_fotoPerfil) await eliminarImagenCloudinary(vendedor.public_id_fotoPerfil);
    for (const dui of vendedor.DUI) await eliminarImagenCloudinary(dui.public_id);
    await vendedoresModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Vendedor eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

// Búsqueda por nombre
vendedoresController.searchByNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) return res.status(400).json({ message: "Debe proporcionar un nombre" });
    const vendedores = await vendedoresModel.find({ nombre: { $regex: nombre, $options: "i" } }).select("-contraseña");
    if (vendedores.length === 0) return res.status(404).json({ message: "No se encontraron vendedores" });
    res.json(vendedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

export default vendedoresController;