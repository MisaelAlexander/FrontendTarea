import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestCode, verifyCode, newPassword } from './recuperarContraseniaApi';

/**
 * Hook para las páginas de recuperación de contraseña del admin.
 * Maneja: los 3 pasos (correo → código → nueva contraseña).
 */
export function useRecuperarContraseniaAdmin() {
  // Navegador para redirecciones
  const navigate = useNavigate();

  // Paso 1: Correo
  const [correo, setCorreo] = useState("");

  // Paso 2: Código PIN
  const [pinCompleto, setPinCompleto] = useState("");

  // Paso 3: Nueva contraseña
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

  // Estados comunes
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Paso 1: Solicita código de verificación por correo.
   */
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    if (!correo.trim()) {
      setError("El campo de correo es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      const data = await requestCode(correo);
      alert(data.message);
      navigate("/codigo-correo");
    } catch (err) {
      const msg = err.response?.data?.message || "Error al enviar el código.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Paso 2: Verifica el código de 6 caracteres.
   */
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    if (pinCompleto.length !== 6) {
      setError("Por favor, ingresa el código completo de 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const data = await verifyCode(pinCompleto);
      setMensaje(data.message);
      setTimeout(() => navigate("/nueva-contraseña"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Código inválido o expirado.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Paso 3: Establece la nueva contraseña.
   */
  const handleNewPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const data = await newPassword(formData.password, formData.confirmPassword);
      alert(data.message);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Error al cambiar la contraseña.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /** Actualiza el PIN completado */
  const handlePinComplete = (codigo) => setPinCompleto(codigo);

  /** Actualiza campos de contraseña */
  const handleChangePassword = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /** Alterna visibilidad de contraseña */
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    // Paso 1
    correo,
    setCorreo,
    handleRequestCode,
    // Paso 2
    pinCompleto,
    handlePinComplete,
    handleVerifyCode,
    // Paso 3
    formData,
    handleChangePassword,
    handleNewPassword,
    // Comunes
    showPassword,
    togglePasswordVisibility,
    error,
    mensaje,
    loading,
  };
}
