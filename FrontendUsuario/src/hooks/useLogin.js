import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Hook para la página Login.
 * Maneja: formulario, visibilidad de contraseña, envío con auth, errores.
 */
export function useLogin() {
  // Navegador para redirección después del login
  const navigate = useNavigate();
  // Función de login del contexto de autenticación
  const { login } = useAuth();

  // Estado: datos del formulario (usuario y contraseña)
  const [formData, setFormData] = useState({ usuario: '', password: '' });
  // Estado: visibilidad del campo contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Estado: mensaje de error
  const [error, setError] = useState('');
  // Estado: indicador de carga durante el envío
  const [loading, setLoading] = useState(false);

  /**
   * Actualiza los campos del formulario.
   * Limpia el error al escribir.
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpia error al modificar
  };

  /**
   * Alterna la visibilidad del campo contraseña.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Envía el formulario de login.
   * Llama a la API de autenticación y redirige al dashboard.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene recarga de página
    setError('');
    setLoading(true);
    try {
      await login(formData.usuario, formData.password); // Llama al auth context
      navigate('/dashboard'); // Redirige al dashboard
    } catch (err) {
      setError(err.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,                // Datos del formulario
    showPassword,            // Visibilidad de contraseña
    error,                   // Mensaje de error
    loading,                 // Estado de carga
    handleChange,            // Handler para inputs
    togglePasswordVisibility,// Toggle de visibilidad
    handleSubmit,            // Handler del formulario
  };
}
