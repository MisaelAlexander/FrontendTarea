import clientesModel from "../../models/Clientes.js";
import bcrypt from "bcryptjs";

const clientesCrudController = {};

// GET - Obtener todos (solo verificados para mostrar en admin)
clientesCrudController.getAllClientes = async (req, res) => {
  try {
    const clientes = await clientesModel.find({ isVerified: true }).select("-contraseña");
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET por ID
clientesCrudController.getClientesById = async (req, res) => {
  try {
    const cliente = await clientesModel.findOne({ _id: req.params.id, isVerified: true }).select("-contraseña");
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json(cliente);
  } catch (error) {
    console.error("Error al obtener cliente por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// UPDATE (solo administradores)
clientesCrudController.updateCliente = async (req, res) => {
  try {
    const { nombre, apellido, usuario, contraseña, correo, Favoritos } = req.body;
    const clienteActual = await clientesModel.findById(req.params.id);
    if (!clienteActual) return res.status(404).json({ message: "Cliente no encontrado" });

    let updateData = {
      nombre: nombre || clienteActual.nombre,
      apellido: apellido || clienteActual.apellido,
      usuario: usuario || clienteActual.usuario,
      correo: correo ? correo.toLowerCase() : clienteActual.correo,
      Favoritos: Favoritos !== undefined ? Favoritos : clienteActual.Favoritos,
    };

    if (contraseña && contraseña.trim() !== "") {
      updateData.contraseña = await bcrypt.hash(contraseña, 10);
    }

    const updated = await clientesModel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .select("-contraseña");
    res.status(200).json({ message: "Cliente actualizado", cliente: updated });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE
clientesCrudController.deleteCliente = async (req, res) => {
  try {
    const cliente = await clientesModel.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
    res.status(200).json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Búsqueda por nombre (query param)
clientesCrudController.searchByNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) return res.status(400).json({ message: "Debe proporcionar un nombre" });
    const clientes = await clientesModel
      .find({ nombre: { $regex: nombre, $options: "i" }, isVerified: true })
      .select("-contraseña");
    if (clientes.length === 0) return res.status(404).json({ message: "No se encontraron clientes" });
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default clientesCrudController;