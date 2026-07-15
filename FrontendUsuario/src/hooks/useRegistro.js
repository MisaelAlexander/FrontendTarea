import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

/**
 * Hook para la página Registro.
 * Maneja: formulario multi-paso, visibilidad de contraseña, registro + verificación de código.
 */
export function useRegistro() {
  // Navegador para redirección
  const navigate = useNavigate();

  // Estado: paso actual del formulario (1=datos, 2=código)
  const [step, setStep] = useState(1);
  // Estado: datos del formulario de registro
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    password: '',
    correo: ''
  });
  // Estado: código de verificación ingresado por el usuario
  const [verificationCode, setVerificationCode] = useState('');
  // Estado: mensaje de error
  const [error, setError] = useState('');
  // Estado: indicador de carga
  const [loading, setLoading] = useState(false);
  // Estado: visibilidad del campo contraseña
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Actualiza los campos del formulario.
   * Limpia el error al escribir.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  /**
   * Alterna la visibilidad del campo contraseña.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Paso 1: Envía los datos de registro a la API.
   * Si es exitoso, avanza al paso 2 (verificación de código).
   */
  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.register(
        formData.nombre,
        formData.apellido,
        formData.usuario,
        formData.password,
        formData.correo
      );
      setStep(2); // Avanza al paso de verificación
    } catch (err) {
      setError(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Paso 2: Verifica el código de registro.
   * Si es exitoso, redirige al login.
   */
  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.verifyRegisterCode(verificationCode);
      navigate('/'); // Redirige al login
    } catch (err) {
      setError(err.message || 'Error al verificar codigo');
    } finally {
      setLoading(false);
    }
  };

  return {
    step,                    // Paso actual (1 o 2)
    formData,                // Datos del formulario
    verificationCode,        // Código de verificación
    setVerificationCode,     // Setter del código
    error,                   // Mensaje de error
    loading,                 // Estado de carga
    showPassword,            // Visibilidad de contraseña
    handleChange,            // Handler para inputs
    togglePasswordVisibility,// Toggle de visibilidad
    handleSubmitStep1,       // Envío del paso 1
    handleSubmitStep2,       // Envío del paso 2
  };
}
