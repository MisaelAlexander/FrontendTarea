import React from "react";
import { User, Eye, EyeOff, Mail, UserCircle } from "lucide-react";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import { useRegistro } from "../hooks/useRegistro";

/**
 * Página de Registro.
 * Formulario multi-paso: datos personales → verificación de código por correo.
 */
export default function App() {
  // Obtiene toda la lógica del hook personalizado
  const {
    step,                    // Paso actual (1=datos, 2=código)
    formData,                // Datos del formulario
    verificationCode,        // Código de verificación
    setVerificationCode,     // Setter del código
    error,                   // Mensaje de error
    loading,                 // Estado de carga
    showPassword,            // Visibilidad de contraseña
    handleChange,            // Handler para inputs
    togglePasswordVisibility,// Toggle de visibilidad
    handleSubmitStep1,       // Envío del paso 1 (registro)
    handleSubmitStep2,       // Envío del paso 2 (verificación)
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
                name="code"
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
            {/* Campo: Nombre */}
            <Input
              label="Nombre"
              name="nombre"
              placeholder="Nombre"
              icon={UserCircle}
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            {/* Campo: Apellido */}
            <Input
              label="Apellido"
              name="apellido"
              placeholder="Apellido"
              icon={UserCircle}
              value={formData.apellido}
              onChange={handleChange}
              required
            />

            {/* Campo: Usuario */}
            <Input
              label="Usuario"
              name="usuario"
              placeholder="Ingrese su usuario"
              icon={User}
              value={formData.usuario}
              onChange={handleChange}
              required
            />

            {/* Campo: Contraseña con toggle */}
            <Input
              label="Contrasena"
              name="password"
              placeholder="Ingrese su contrasena"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Campo: Correo */}
            <Input
              label="Correo"
              name="correo"
              placeholder="Ingrese su correo"
              type="email"
              icon={Mail}
              value={formData.correo}
              onChange={handleChange}
              required
            />

            {/* Mensaje de error */}
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

            {/* Link para volver al login */}
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

            {/* Botón de registro */}
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
