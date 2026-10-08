import clientesModel from "../../models/Clientes.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../../../config.js";
import { sendEmail } from "../../utils/sendMailjet.js";
import HTMLRegisterEmail from "../../utils/sendMailRegister.js";

const registerClient = {};

// Paso 1: Iniciar registro (envía código de 6 dígitos al correo)
registerClient.register = async (req, res) => {
  try {
    const { nombre, apellido, usuario, contraseña, correo } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !usuario || !contraseña || !correo) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si ya existe usuario o correo
    const existente = await clientesModel.findOne({
      $or: [{ usuario }, { correo: correo.toLowerCase() }],
    });
    if (existente) {
      return res.status(400).json({ message: "El usuario o correo ya está registrado" });
    }

    // Hashear contraseña antes de firmarla en el token
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Código de verificación de 6 dígitos
    const verificationCode = String(crypto.randomInt(100000, 1000000));

    // Token con los datos pendientes (expira en 15 minutos)
    const token = jwt.sign(
      {
        nombre,
        apellido,
        usuario,
        correo: correo.toLowerCase(),
        password: hashedPassword,
        verificationCode,
      },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("clientVerificationToken", token, { maxAge: 15 * 60 * 1000 });

    try {
      await sendEmail({
        to: correo,
        subject: "Código de verificación - Techne Meraki",
        html: HTMLRegisterEmail(verificationCode),
      });
    } catch (error) {
      console.log("Error enviando correo: " + error);
      return res.status(500).json({ message: "Error al enviar el correo" });
    }

    // El token también viaja en el cuerpo para clientes sin cookies (móvil / cross-site).
    res.status(200).json({ message: "Código enviado a tu correo", verificationToken: token });
  } catch (error) {
    console.error("Error en registro:", error);
    if (error?.code === 11000) {
      return res.status(400).json({ message: "El usuario o correo ya está registrado" });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Paso 2: Verificar código y crear cliente en BD
registerClient.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest, verificationToken } = req.body;
    // Acepta el token del cuerpo (móvil / cross-site sin cookies) o de la cookie (web mismo sitio)
    const token = verificationToken || req.cookies?.clientVerificationToken;

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