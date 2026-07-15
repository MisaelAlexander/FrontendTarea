import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // TODO: Implementar llamada a API para enviar mensaje
      console.log('Mensaje enviado:', data);
      setSuccess(true);
      reset();
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-md">
      <h2 className="text-lg font-extrabold text-black mb-6">Escribenos tus dudas</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label className="text-sm text-black font-medium mb-1.5">Nombre</label>
          <input
            type="text"
            className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#568dc6] transition-shadow ${
              errors.nombre ? 'border-red-500' : 'border-gray-400'
            }`}
            {...register('nombre', {
              required: 'El nombre es obligatorio',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
            })}
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-black font-medium mb-1.5">Correo</label>
          <input
            type="email"
            className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#568dc6] transition-shadow ${
              errors.correo ? 'border-red-500' : 'border-gray-400'
            }`}
            {...register('correo', {
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico inválido',
              },
            })}
          />
          {errors.correo && (
            <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-black font-medium mb-1.5">Mensaje</label>
          <textarea
            rows={4}
            className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#568dc6] transition-shadow resize-none ${
              errors.mensaje ? 'border-red-500' : 'border-gray-400'
            }`}
            {...register('mensaje', {
              required: 'El mensaje es obligatorio',
              minLength: { value: 10, message: 'Mínimo 10 caracteres' },
            })}
          />
          {errors.mensaje && (
            <p className="text-red-500 text-xs mt-1">{errors.mensaje.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">Mensaje enviado correctamente</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#4880be] hover:bg-[#386ba5] text-white font-bold py-2.5 px-8 rounded-xl transition-colors shadow-sm mt-2 w-32 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
