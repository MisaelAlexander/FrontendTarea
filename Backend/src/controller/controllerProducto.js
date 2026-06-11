import productosModel from "../models/Productos.js";
import { v2 as cloudinary } from "cloudinary";

const productosController = {};

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

// GET - Obtener todos los productos
productosController.getAllProductos = async (req, res) => {
  try {
    const productos = await productosModel.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener producto por ID
productosController.getProductosById = async (req, res) => {
  try {
    const producto = await productosModel.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST - Crear producto con imágenes subidas a Cloudinary
productosController.insertProductos = async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio, sucursal, descuento, colores } = req.body;

    // Validaciones básicas
    if (!nombre || !descripcion || !stock || !precio || !sucursal) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Procesar imágenes subidas (campo "imagenesProductos")
    let imagenesProductos = [];
    if (req.files && req.files.length > 0) {
      imagenesProductos = req.files.map(file => ({
        imagen: file.path,      // URL de Cloudinary
        public_id: file.filename, // ID único para eliminar
      }));
    }

    // Procesar colores (puede venir como string separado por comas o array)
    let coloresArray = [];
    if (colores) {
      if (Array.isArray(colores)) {
        coloresArray = colores;
      } else if (typeof colores === "string") {
        coloresArray = colores.split(",").map(c => c.trim());
      }
    }

    const newProducto = new productosModel({
      nombre,
      descripcion,
      stock: Number(stock),
      precio: Number(precio),
      sucursal,
      descuento: descuento ? Number(descuento) : 0,
      imagenesProductos,
      colores: coloresArray,
    });

    await newProducto.save();
    res.status(201).json({ message: "Producto creado exitosamente", producto: newProducto });
  } catch (error) {
    console.error("Error al insertar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT - Actualizar producto (con eliminación de imágenes viejas)
productosController.updateProductos = async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio, sucursal, descuento, colores } = req.body;
    const productoActual = await productosModel.findById(req.params.id);
    if (!productoActual) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Preparar datos a actualizar
    let updateData = {
      nombre: nombre || productoActual.nombre,
      descripcion: descripcion || productoActual.descripcion,
      stock: stock !== undefined ? Number(stock) : productoActual.stock,
      precio: precio !== undefined ? Number(precio) : productoActual.precio,
      sucursal: sucursal || productoActual.sucursal,
      descuento: descuento !== undefined ? Number(descuento) : productoActual.descuento,
    };

    // Procesar colores
    if (colores) {
      let coloresArray = [];
      if (Array.isArray(colores)) {
        coloresArray = colores;
      } else if (typeof colores === "string") {
        coloresArray = colores.split(",").map(c => c.trim());
      }
      updateData.colores = coloresArray;
    }

    // Verificar si se solicita eliminar todas las imágenes
    if (req.body.removeImages === 'true') {
      for (const img of productoActual.imagenesProductos) {
        await eliminarImagenCloudinary(img.public_id);
      }
      updateData.imagenesProductos = [];
    }
    // Si se subieron nuevas imágenes, reemplazan las anteriores
    else if (req.files && req.files.length > 0) {
      for (const img of productoActual.imagenesProductos) {
        await eliminarImagenCloudinary(img.public_id);
      }
      updateData.imagenesProductos = req.files.map(file => ({
        imagen: file.path,
        public_id: file.filename,
      }));
    } else {
      // Mantener las existentes
      updateData.imagenesProductos = productoActual.imagenesProductos;
    }

    const updatedProducto = await productosModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Producto actualizado", producto: updatedProducto });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE - Eliminar producto (y sus imágenes de Cloudinary)
productosController.deleteProductos = async (req, res) => {
  try {
    const producto = await productosModel.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar cada imagen de Cloudinary
    for (const img of producto.imagenesProductos) {
      await eliminarImagenCloudinary(img.public_id);
    }

    await productosModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Búsqueda por nombre (query param)
productosController.searchByNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      return res.status(400).json({ message: "Debe proporcionar un nombre para buscar" });
    }
    const productos = await productosModel.find({
      nombre: { $regex: nombre, $options: "i" }
    });
    if (productos.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos con ese nombre" });
    }
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error en búsqueda por nombre:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default productosController;