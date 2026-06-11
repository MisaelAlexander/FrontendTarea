import clientesModel from "../../models/Clientes.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../../../config.js";

const registerClient = {};

// Paso 1: Registrar (solicitar datos, enviar código por correo, guardar token en cookie)
registerClient.register = async (req, res) => {
  try {
    const { nombre, apellido, usuario, contraseña, correo } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !usuario || !contraseña || !correo) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si ya existe usuario o correo (incluso no verificados)
    const existente = await clientesModel.findOne({
      $or: [{ usuario }, { correo: correo.toLowerCase() }],
    });
    if (existente) {
      return res.status(400).json({ message: "El usuario o correo ya está registrado" });
    }

    // Generar código de verificación (6 dígitos)
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear token JWT que contiene todos los datos y el código
    const tokenData = {
      nombre,
      apellido,
      usuario,
      correo: correo.toLowerCase(),
      password: hashedPassword,
      verificationCode,
    };

    const token = jwt.sign(tokenData, config.JWT.secret, { expiresIn: "15m" });

    // Guardar token en cookie (httpOnly, expira en 15 min)
    res.cookie("clientVerificationToken", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    // Enviar correo con el código
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
      subject: "Verificación de cuenta - TechnoMeraki",
      text: `Hola ${nombre}, tu código de verificación es: ${verificationCode}. Válido por 15 minutos.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Código enviado. Revisa tu correo para completar el registro." });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Paso 2: Verificar código y crear cliente en BD
registerClient.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest } = req.body;
    const token = req.cookies.clientVerificationToken;

    if (!token) {
      return res.status(400).json({ message: "No hay proceso de registro activo. Regístrate nuevamente." });
    }

    // Decodificar token
    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT.secret);
    } catch (err) {
      return res.status(401).json({ message: "Token inválido o expirado. Vuelve a registrarte." });
    }

    const { nombre, apellido, usuario, correo, password, verificationCode } = decoded;

    // Comparar código
    if (verificationCodeRequest !== verificationCode) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    // Guardar el cliente en la base de datos (verificado)
    const nuevoCliente = new clientesModel({
      nombre,
      apellido,
      usuario,
      contraseña: password,
      correo,
      isVerified: true,
      Favoritos: [],
    });

    await nuevoCliente.save();

    // Limpiar cookie
    res.clearCookie("clientVerificationToken");
    res.status(201).json({ message: "Cuenta verificada y registrada exitosamente" });
  } catch (error) {
    console.error("Error en verificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default registerClient;