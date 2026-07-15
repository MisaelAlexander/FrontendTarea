import productosModel from "../models/Productos.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * Controller de Productos.
 * Maneja todas las operaciones CRUD para productos.
 */
const productosController = {};

/**
 * Función auxiliar para eliminar imágenes de Cloudinary.
 * @param {string} publicId - ID público de la imagen en Cloudinary
 */
const eliminarImagenCloudinary = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Error eliminando imagen ${publicId}:`, error);
    }
  }
};

/**
 * GET - Obtener todos los productos.
 * Retorna la lista completa de productos.
 */
productosController.getAllProductos = async (req, res) => {
  try {
    const productos = await productosModel.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * GET - Obtener producto por ID.
 * @param {string} req.params.id - ID del producto
 */
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

/**
 * POST - Crear un nuevo producto.
 * Recibe datos del producto y opcionalmente imágenes subidas a Cloudinary.
 * @body {string} nombre - Nombre del producto
 * @body {string} descripcion - Descripción del producto
 * @body {number} stock - Cantidad en inventario
 * @body {number} precio - Precio unitario
 * @body {string} categoria - Categoría del producto
 * @body {string} sucursal - Sucursal donde se encuentra
 * @body {number} [descuento] - Porcentaje de descuento (opcional)
 * @body {string} [colores] - Colores separados por comas (opcional)
 */
productosController.insertProductos = async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio, categoria, sucursal, descuento, colores } = req.body;

    // Validaciones básicas
    if (!nombre || !descripcion || !stock || !precio || !categoria || !sucursal) {
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
      categoria,
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

/**
 * PUT - Actualizar un producto existente.
 * Elimina imágenes viejas de Cloudinary si se suben nuevas.
 * @param {string} req.params.id - ID del producto a actualizar
 */
productosController.updateProductos = async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio, categoria, sucursal, descuento, colores } = req.body;
    const productoActual = await productosModel.findById(req.params.id);
    if (!productoActual) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Preparar datos a actualizar (mantiene valores actuales si no se envían nuevos)
    let updateData = {
      nombre: nombre || productoActual.nombre,
      descripcion: descripcion || productoActual.descripcion,
      stock: stock !== undefined ? Number(stock) : productoActual.stock,
      precio: precio !== undefined ? Number(precio) : productoActual.precio,
      categoria: categoria || productoActual.categoria,
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

/**
 * DELETE - Eliminar un producto.
 * Elimina también todas sus imágenes de Cloudinary.
 * @param {string} req.params.id - ID del producto a eliminar
 */
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

/**
 * GET - Búsqueda por nombre (query param).
 * Busca productos cuyo nombre contenga el término de búsqueda.
 * @query {string} nombre - Término de búsqueda (insensible a mayúsculas)
 */
productosController.searchByNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      return res.status(400).json({ message: "Debe proporcionar un nombre para buscar" });
    }
    const productos = await productosModel.find({
      nombre: { $regex: nombre, $options: "i" } // Búsqueda parcial, insensible a caso
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

/**
 * GET - Obtener productos por categoría.
 * @query {string} categoria - Nombre de la categoría
 */
productosController.getByCategory = async (req, res) => {
  try {
    const { categoria } = req.query;
    if (!categoria) {
      return res.status(400).json({ message: "Debe proporcionar una categoría" });
    }
    const productos = await productosModel.find({
      categoria: { $regex: categoria, $options: "i" }
    });
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default productosController;
