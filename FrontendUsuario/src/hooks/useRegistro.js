import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useForm } from 'react-hook-form';

/**
 * Hook para la página Registro.
 * Maneja: formulario multi-paso con react-hook-form, visibilidad de contraseña, registro + verificación de código.
 */
export function useRegistro() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit: hookSubmitStep1,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      apellido: '',
      usuario: '',
      password: '',
      correo: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitStep1 = async (data) => {
    setError('');
    setLoading(true);
    try {
      await api.register(data.nombre, data.apellido, data.usuario, data.password, data.correo);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.verifyRegisterCode(verificationCode);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al verificar codigo');
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    verificationCode,
    setVerificationCode,
    error,
    loading,
    showPassword,
    errors,
    register,
    watch,
    handleSubmitStep1: hookSubmitStep1(onSubmitStep1),
    handleSubmitStep2,
    togglePasswordVisibility,
  };
}
