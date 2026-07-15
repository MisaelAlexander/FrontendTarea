import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { useToast } from "../components/Toast";
import api from "../services/api";
import { useForm } from "react-hook-form";

export default function App() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.requestRecoveryCode(data.correo);
      toast.success('Código de verificación enviado a tu correo');
      navigate("/codigo-correo");
    } catch (err) {
      toast.error(err.message || "Correo incorrecto o no registrado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      <CircleAnimation numCircles={20} />
      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Recuperar Contrasena
            </h1>
            <p className="text-gray-500 mt-1">Ingrese su correo para recibir el codigo</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Correo"
              type="email"
              placeholder="Ingrese su correo"
              error={errors.correo?.message}
              {...register('correo', {
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido',
                },
              })}
            />
            <div className="text-center mb-8">
              <p className="text-gray-500 mt-1">
                <a
                  href="/"
                  className="text-[#1a365d] hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33] font-medium"
                >
                  Volver al login
                </a>
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Codigo"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
