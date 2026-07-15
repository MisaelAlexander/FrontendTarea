import React from "react";
import { User, Eye, EyeOff, Mail, UserCircle } from "lucide-react";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";

import { useRegistro } from "../hooks/useRegistro";

/**
 * Página de Registro.
 * Formulario multi-paso con react-hook-form: datos personales → verificación de código por correo.
 */
export default function App() {
  const {
    step,
    verificationCode,
    setVerificationCode,
    error,
    loading,
    showPassword,
    errors,
    register,
    handleSubmitStep1,
    handleSubmitStep2,
    togglePasswordVisibility,
  } = useRegistro();

  // === PASO 2: Verificación de código ===
  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
        <CircleAnimation numCircles={20} />
        <div className="flex-grow flex items-center justify-center p-4 relative z-10">
          <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
            <div className="text-center mb-8">
              <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
                Verificar Codigo
              </h1>
              <p className="text-gray-500 mt-1">Revisa tu correo para el codigo de verificacion</p>
            </div>
            <form onSubmit={handleSubmitStep2}>
              <Input
                label="Codigo de Verificacion"
                placeholder="Ingrese el codigo de 6 digitos"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
              <div className="flex justify-center mt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Verificando..." : "Verificar Codigo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // === PASO 1: Formulario de datos personales ===
  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      <CircleAnimation numCircles={20} />
      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Registrarse
            </h1>
            <p className="text-gray-500 mt-1">Se parte de nuestra familia</p>
          </div>
          <form onSubmit={handleSubmitStep1}>
            <Input
              label="Nombre"
              placeholder="Nombre"
              icon={UserCircle}
              error={errors.nombre?.message}
              {...register('nombre', {
                required: 'El nombre es obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                maxLength: { value: 50, message: 'Máximo 50 caracteres' },
              })}
            />

            <Input
              label="Apellido"
              placeholder="Apellido"
              icon={UserCircle}
              error={errors.apellido?.message}
              {...register('apellido', {
                required: 'El apellido es obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                maxLength: { value: 50, message: 'Máximo 50 caracteres' },
              })}
            />

            <Input
              label="Usuario"
              placeholder="Ingrese su usuario"
              icon={User}
              error={errors.usuario?.message}
              {...register('usuario', {
                required: 'El usuario es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                maxLength: { value: 30, message: 'Máximo 30 caracteres' },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Solo letras, números y guión bajo' },
              })}
            />

            <Input
              label="Contrasena"
              placeholder="Ingrese su contrasena"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              error={errors.password?.message}
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />

            <Input
              label="Correo"
              placeholder="Ingrese su correo"
              type="email"
              icon={Mail}
              error={errors.correo?.message}
              {...register('correo', {
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido',
                },
              })}
            />

            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

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
                {loading ? "Enviando..." : "Registrar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
