import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import HTMLRecoveryEmail from "../../utils/sendMailRecovery.js";

import { config } from "../../../config.js";

import administradoresModel from "../../models/Administradores.js";

const recoveryPasswordAdminController = {};

// 1. Solicitar el código por correo electrónico
recoveryPasswordAdminController.requestCode = async (req, res) => {
  try {
    const { correo } = req.body; // ← ahora recibe 'correo'

    // Buscar administrador cuyo campo 'usuario' sea igual al correo recibido
    const adminFound = await administradoresModel.findOne({ correo: correo });

    if (!adminFound) {
      // Por seguridad, no revelamos si existe o no
      return res.json({ message: "No se ha encontrado tu correo" });
    }

    // Generar código aleatorio de 6 caracteres hexadecimales
    const code = crypto.randomBytes(3).toString("hex");

    // Guardar la información en un token JWT
    const token = jsonwebtoken.sign(
      { email: correo, code, userType: "admin", verified: false },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    // Establecer la cookie con el token
    res.cookie("recoveryCookieAdmin", token, { maxAge: 15 * 60 * 1000 });

    // Configurar el transportador de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: correo,
      subject: "Recuperación de contraseña - Administrador",
      html: HTMLRecoveryEmail(code),
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error enviando correo: " + error);
        return res.status(500).json({ message: "Error al enviar el correo" });
      }
      return res.status(200).json({ message: "Correo enviado" });
    });
  } catch (error) {
    console.log("Error en requestCode: " + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 2. Verificar el código ingresado por el usuario
recoveryPasswordAdminController.verifyCode = async (req, res) => {
  try {
    const { codeRequest } = req.body;

    const token = req.cookies.recoveryCookieAdmin;
    if (!token) {
      return res.status(400).json({ message: "No hay solicitud de recuperación activa" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (codeRequest !== decoded.code) {
      return res.status(400).json({ message: "Código inválido" });
    }

    const newToken = jsonwebtoken.sign(
      { email: decoded.email, userType: "admin", verified: true },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("recoveryCookieAdmin", newToken, { maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ message: "Código verificado correctamente" });
  } catch (error) {
    console.log("Error en verifyCode: " + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 3. Establecer la nueva contraseña
recoveryPasswordAdminController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const token = req.cookies.recoveryCookieAdmin;
    if (!token) {
      return res.status(400).json({ message: "No hay solicitud de recuperación activa" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "El código aún no ha sido verificado" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await administradoresModel.findOneAndUpdate(
      { correo: decoded.email },
      { contraseña: passwordHash },
      { new: true }
    );

    res.clearCookie("recoveryCookieAdmin");

    return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.log("Error en newPassword: " + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default recoveryPasswordAdminController;