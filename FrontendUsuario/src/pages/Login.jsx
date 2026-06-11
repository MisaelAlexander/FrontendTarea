import React, { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    alert(`Iniciando sesión con: ${formData.usuario}`);
    navigate("/dashboard");
  };

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
              name="usuario"
              placeholder="Ingrese su usuario"
              icon={User}
              value={formData.usuario}
              onChange={handleChange}
            />

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
                   href="/registro" // Cambié esto a /registro por lógica, pero puedes mantenerlo
                   className="text-[#1a365d] hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33] font-medium"
                 >
                   {"registrate"}
                 </a>
               </p>
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit">Iniciar sesión</Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}