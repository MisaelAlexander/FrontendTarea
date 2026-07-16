import React from "react";
import { motion } from "framer-motion";
import { User, Eye, EyeOff } from "lucide-react";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";

import { useLogin } from "../hooks/useLogin";

/**
 * Página de Login.
 * Formulario de inicio de sesión con react-hook-form y validaciones.
 */
export default function App() {
  const {
    showPassword,
    error,
    loading,
    errors,
    register,
    handleSubmit,
    togglePasswordVisibility,
  } = useLogin();

  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      <CircleAnimation numCircles={20} />

      <motion.div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-gray-500 mt-1">Ingresa tus credenciales para acceder</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Usuario"
              placeholder="Ingrese su usuario"
              icon={User}
              error={errors.usuario?.message}
              {...register('usuario', {
                required: 'El usuario es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              })}
            />

            <Input
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              error={errors.password?.message}
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />

            <div className="text-center mb-8">
              <p className="font text-[#1a365d] mt-1">
                <a
                  href="/recuperar-contraseña"
                  className="hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33]"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </p>
              <p className="text-gray-500 mt-1">
                No tienes cuenta,{" "}
                <a
                  href="/registro"
                  className="text-[#1a365d] hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33] font-medium"
                >
                  registrate
                </a>
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesion"}
              </Button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mt-4">{error}</p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
