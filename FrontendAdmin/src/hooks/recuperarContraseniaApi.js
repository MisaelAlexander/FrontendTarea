import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || "http://localhost:4000";

// 1. Solicitar código al correo (POST /api/recuperar-admin/request-code)
export const requestCode = async (correo) => {
  const res = await axios.post(
    `${API_URL}/api/recuperar-admin/request-code`,
    { correo },               // ← ahora envía { correo: "correo@ejemplo.com" }
    { withCredentials: true } // imprescindible para recibir la cookie
  );
  return res.data;
};

// 2. Verificar el código enviado (POST /api/recuperar-admin/verify-code)
export const verifyCode = async (codeRequest) => {
  const res = await axios.post(
    `${API_URL}/api/recuperar-admin/verify-code`,
    { codeRequest },
    { withCredentials: true }
  );
  return res.data;
};

// 3. Establecer nueva contraseña (POST /api/recuperar-admin/new-password)
export const newPassword = async (newPassword, confirmNewPassword) => {
  const res = await axios.post(
    `${API_URL}/api/recuperar-admin/new-password`,
    { newPassword, confirmNewPassword },
    { withCredentials: true }
  );
  return res.data;
};