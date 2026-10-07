// controllers/recoveryPasswordClienteController.js
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendMailjet.js";
import HTMLRecoveryEmail from "../../utils/sendMailRecovery.js";
import { config } from "../../../config.js";
import clientesModel from "../../models/Clientes.js";

const recoveryPasswordClienteController = {};

// Paso 1: Solicitar código por correo
recoveryPasswordClienteController.requestCode = async (req, res) => {
  try {
    const { correo } = req.body;

    const cliente = await clientesModel.findOne({ correo });
    if (!cliente) {
      return res.json({ message: "Si el correo existe, recibirás un código" });
    }

    const code = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      { email: correo, code, userType: "cliente", verified: false },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("recoveryCookieCliente", token, { maxAge: 15 * 60 * 1000 });

    try {
      await sendEmail({
        to: correo,
        subject: "Recuperación de contraseña - Cliente",
        html: HTMLRecoveryEmail(code),
      });
    } catch (error) {
      console.log("Error enviando correo: " + error);
      return res.status(500).json({ message: "Error al enviar el correo" });
    }
    // El token también viaja en el cuerpo para clientes sin cookies (móvil / cross-site).
    return res.status(200).json({ message: "Correo enviado", recoveryToken: token });
  } catch (error) {
    console.log("Error en requestCode: " + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Paso 2: Verificar código
recoveryPasswordClienteController.verifyCode = async (req, res) => {
  try {
    const { codeRequest, recoveryToken } = req.body;
    const token = recoveryToken || req.cookies?.recoveryCookieCliente;
    if (!token) {
      return res.status(400).json({ message: "No hay solicitud activa" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    if (codeRequest !== decoded.code) {
      return res.status(400).json({ message: "Código inválido" });
    }

    const newToken = jsonwebtoken.sign(
      { email: decoded.email, userType: "cliente", verified: true },
      config.JWT.secret,
      { expiresIn: "15m" }
    );
    res.cookie("recoveryCookieCliente", newToken, { maxAge: 15 * 60 * 1000 });
    return res.status(200).json({ message: "Código verificado correctamente", recoveryToken: newToken });
  } catch (error) {
    console.log("Error en verifyCode: " + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Paso 3: Nueva contraseña
recoveryPasswordClienteController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword, recoveryToken } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const token = recoveryToken || req.cookies?.recoveryCookieCliente;
    if (!token) {
      return res.status(400).json({ message: "No hay solicitud activa" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    if (!decoded.verified) {
      return res.status(400).json({ message: "El código aún no ha sido verificado" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await clientesModel.findOneAndUpdate(
      { correo: decoded.email },
      { contraseña: passwordHash },
      { new: true }
    );

    res.clearCookie("recoveryCookieCliente");
    return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.log("Error en newPassword: " + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default recoveryPasswordClienteController;