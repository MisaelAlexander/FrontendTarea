import React from "react";
import { User, Eye, EyeOff } from "lucide-react";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import { useLogin } from "../hooks/useLogin";

/**
 * Página de Login.
 * Formulario de inicio de sesión con validación y redirección al dashboard.
 */
export default function App() {
  // Obtiene toda la lógica del hook personalizado
  const {
    formData,                // Datos del formulario (usuario, password)
    showPassword,            // Visibilidad del campo contraseña
    error,                   // Mensaje de error
    loading,                 // Estado de carga durante envío
    handleChange,            // Handler para actualizar inputs
    togglePasswordVisibility,// Función para mostrar/ocultar contraseña
    handleSubmit,            // Handler del formulario
  } = useLogin();

  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      {/* Animación de círculos de fondo */}
      <CircleAnimation numCircles={20} />

      {/* Contenedor del formulario con animación */}
      <motion.div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          {/* Título y subtítulo */}
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-gray-500 mt-1">Ingresa tus credenciales para acceder</p>
          </div>

          {/* Formulario de login */}
          <form onSubmit={handleSubmit}>
            {/* Campo de usuario */}
            <Input
              label="Usuario"
              name="usuario"
              placeholder="Ingrese su usuario"
              icon={User}
              value={formData.usuario}
              onChange={handleChange}
            />

            {/* Campo de contraseña con toggle de visibilidad */}
            <Input
              label="Contraseña"
              name="password"
              placeholder="Ingrese su contraseña"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              value={formData.password}
              onChange={handleChange}
            />

            {/* Links de recuperar contraseña y registro */}
            <div className="text-center mb-8">
              <p className="font text-[#1a365d] mt-1">
                 <a
                   href="/recuperar-contraseña"
                   className="hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33]"
                 >
                   {"¿Olvidaste tu contraseña?"}
                 </a>
               </p>

               <p className="text-gray-500 mt-1">
                 {"No tienes cuenta, "}
                 <a
                   href="/registro"
                   className="text-[#1a365d] hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33] font-medium"
                 >
                   {"registrate"}
                 </a>
               </p>
            </div>

            {/* Botón de envío */}
            <div className="flex justify-center mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesion"}
              </Button>
            </div>

            {/* Mensaje de error */}
            {error && (
              <p className="text-red-500 text-sm text-center mt-4">{error}</p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
