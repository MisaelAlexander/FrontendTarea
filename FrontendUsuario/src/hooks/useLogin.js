import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

/**
 * Hook para la página Login.
 * Maneja: formulario con react-hook-form, visibilidad de contraseña, envío con auth, errores.
 */
export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit: hookSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      usuario: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await login(data.usuario, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return {
    showPassword,
    error,
    loading,
    errors,
    register,
    handleSubmit: hookSubmit(onSubmit),
    togglePasswordVisibility,
  };
}
