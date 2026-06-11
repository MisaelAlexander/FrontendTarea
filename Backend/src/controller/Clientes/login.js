// controllers/clientesAuthController.js
import clientesModel from "../../models/Clientes.js";
import bcrypt from "bcryptjs";

const clientesAuthController = {};

// LOGIN
clientesAuthController.login = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    const cliente = await clientesModel.findOne({ usuario });
    if (!cliente) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const passwordValida = await bcrypt.compare(contraseña, cliente.contraseña);
    if (!passwordValida) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Crear cookie con el ID del cliente (puedes cambiarlo por un JWT si quieres)
    res.cookie("clienteToken", cliente._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hora
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Login exitoso",
      clienteId: cliente._id,
      nombre: cliente.nombre,
      usuario: cliente.usuario,
    });
  } catch (error) {
    console.log("Error en login: " + error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// LOGOUT
clientesAuthController.logout = (req, res) => {
  res.clearCookie("clienteToken");
  return res.status(200).json({ message: "Sesión cerrada" });
};

// (Opcional) Verificar si la sesión es válida
clientesAuthController.checkSession = async (req, res) => {
  try {
    const token = req.cookies.clienteToken;
    if (!token) {
      return res.status(401).json({ message: "No hay sesión activa" });
    }
    const cliente = await clientesModel.findById(token).select("-contraseña");
    if (!cliente) {
      return res.status(401).json({ message: "Sesión inválida" });
    }
    return res.status(200).json({ cliente });
  } catch (error) {
    console.log("Error en checkSession: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default clientesAuthController;