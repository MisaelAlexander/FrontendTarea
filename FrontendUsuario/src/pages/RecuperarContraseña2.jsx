import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.resetPassword(data.newPassword, data.confirmPassword);
      toast.success("Contraseña cambiada correctamente");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Error al cambiar contrasena");
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
              Cambiar Contrasena
            </h1>
            <p className="text-gray-500 mt-1">Establece una nueva contrasena segura</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Nueva Contrasena"
              placeholder="Ingrese su nueva contrasena"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />

            <Input
              label="Confirmar Contrasena"
              placeholder="Confirme su nueva contrasena"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Confirma la contraseña',
                validate: (value) =>
                  value === watch('newPassword') || 'Las contraseñas no coinciden',
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
                {loading ? "Guardando..." : "Guardar Contrasena"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
