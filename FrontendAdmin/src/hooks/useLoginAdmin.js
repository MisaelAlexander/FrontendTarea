import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para la página Login del admin.
 * Maneja: formulario, visibilidad de contraseña, envío de login, errores.
 */
export function useLoginAdmin() {
  // Navegador para redirección
  const navigate = useNavigate();

  // Estado: datos del formulario (usuario, password)
  const [formData, setFormData] = useState({ usuario: "", password: "" });
  // Estado: visibilidad del campo contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Estado: indicador de carga
  const [loading, setLoading] = useState(false);
  // Estado: mensaje de error
  const [error, setError] = useState("");

  /**
   * Actualiza los campos del formulario.
   * Limpia el error al escribir.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  /** Alterna la visibilidad de la contraseña */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Envía el formulario de login al backend.
   * Crea cookie httpOnly con el token de sesión.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_BASE_URL = "http://localhost:4000";
      const response = await fetch(`${API_BASE_URL}/api/login-admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: formData.usuario,
          contraseña: formData.password,
        }),
        credentials: "include", // Necesario para recibir la cookie
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      console.log("Login exitoso:", data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,                // Datos del formulario
    showPassword,            // Visibilidad de contraseña
    loading,                 // Estado de carga
    error,                   // Mensaje de error
    handleChange,            // Handler para inputs
    togglePasswordVisibility,// Toggle de visibilidad
    handleSubmit,            // Handler del formulario
  };
}
