// Archivo: controllers/adminAuthController.js
import AdministradoresModel from "../../models/Administradores.js";
import bcrypt from "bcryptjs"; // o "bcrypt"

const adminAuthController = {};

// LOGIN - Iniciar sesión y crear cookie
adminAuthController.login = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    // Buscar administrador por nombre de usuario
    const admin = await AdministradoresModel.findOne({ usuario });
    if (!admin) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Comparar la contraseña ingresada con la hasheada en la BD
    const passwordValida = await bcrypt.compare(contraseña, admin.contraseña);
    if (!passwordValida) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Crear cookie (httpOnly, segura, con tiempo de expiración)
    res.cookie("adminToken", admin._id, {
      httpOnly: true,      // Evita acceso desde JavaScript del lado del cliente
      secure: false,       // Cambiar a true si usas HTTPS
      maxAge: 3600000,     // 1 hora (en milisegundos)
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Login exitoso",
      adminId: admin._id,
      nombre: admin.nombre,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// (Opcional) Logout - eliminar la cookie
adminAuthController.logout = (req, res) => {
  res.clearCookie("adminToken");
  return res.status(200).json({ message: "Sesión cerrada" });
};

export default adminAuthController;