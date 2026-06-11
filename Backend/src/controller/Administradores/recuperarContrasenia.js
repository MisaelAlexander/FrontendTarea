// controllers/recoveryPasswordAdminController.js
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import HTMLRecoveryEmail from "../../models/Administradores.js";

import { config } from "../../../config.js";

import administradoresModel from "../../models/Administradores.js";

const recoveryPasswordAdminController = {};

// 1. Solicitar el código por correo electrónico (usando el campo 'usuario' como email)
recoveryPasswordAdminController.requestCode = async (req, res) => {
  try {
    const { usuario } = req.body; // 'usuario' contiene el correo electrónico

    // Validar que el usuario (correo) exista en la BD de administradores
    const adminFound = await administradoresModel.findOne({ usuario });

    if (!adminFound) {
      // Por seguridad, no revelamos si existe o no, pero podemos devolver un mensaje genérico
      return res.json({ message: "Si el correo existe, recibirás un código" });
    }

    // Generar código aleatorio de 6 caracteres hexadecimales
    const code = crypto.randomBytes(3).toString("hex");

    // Guardar la información en un token JWT
    const token = jsonwebtoken.sign(
      { email: usuario, code, userType: "admin", verified: false },
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
      to: usuario,
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

    // Nota: no se debe enviar respuesta después de sendMail porque ya se envía dentro del callback.
    // Sin embargo, el callback ya retorna. Para evitar doble respuesta, quitamos el return de abajo.
  } catch (error) {
    console.log("Error en requestCode: " + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 2. Verificar el código ingresado por el usuario
recoveryPasswordAdminController.verifyCode = async (req, res) => {
  try {
    const { codeRequest } = req.body;

    // Obtener el token de la cookie
    const token = req.cookies.recoveryCookieAdmin;
    if (!token) {
      return res.status(400).json({ message: "No hay solicitud de recuperación activa" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    // Comparar el código proporcionado con el almacenado en el token
    if (codeRequest !== decoded.code) {
      return res.status(400).json({ message: "Código inválido" });
    }

    // Si el código es correcto, generar un nuevo token con el flag verified = true
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

    // Validar que ambas contraseñas coincidan
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const token = req.cookies.recoveryCookieAdmin;
    if (!token) {
      return res.status(400).json({ message: "No hay solicitud de recuperación activa" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    // Verificar que el código haya sido verificado previamente
    if (!decoded.verified) {
      return res.status(400).json({ message: "El código aún no ha sido verificado" });
    }

    // Encriptar la nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del administrador en la base de datos
    await administradoresModel.findOneAndUpdate(
      { usuario: decoded.email },
      { contraseña: passwordHash },
      { new: true }
    );

    // Limpiar la cookie
    res.clearCookie("recoveryCookieAdmin");

    return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.log("Error en newPassword: " + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default recoveryPasswordAdminController;