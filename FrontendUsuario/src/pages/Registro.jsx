import React, { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";

export default function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    alert(`te has regitrado con exito: ${formData.usuario}`);
    navigate("/");
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      <CircleAnimation numCircles={20} />
      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Registrase
            </h1>
            <p className="text-gray-500 mt-1">Se parte de nuestra familia</p>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              label="Nombre"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />

            <Input
              label="Apellido"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
            />

            <Input
               label="Usuario"
               name="usuario"
               placeholder="Ingrese su usuario"
               value={formData.usuario}
               onChange={handleChange}
            />

            <Input
               label="Contraseña"
               name="password"
               placeholder="Ingrese su contraseña"
               value={formData.password}
               onChange={handleChange}
            />

            <Input
               label="Email"
               name="email"
               placeholder="Ingrese su correo"
               value={formData.email}
               onChange={handleChange}
            />


            <div className="text-center mb-8">
               <p className="text-gray-500 mt-1">
                 <a 
                   href="/" // Cambié esto a /registro por lógica, pero puedes mantenerlo
                   className="text-[#1a365d] hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33] font-medium"
                 >
                   {"Volver al login"}
                 </a>
               </p>
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit">Registrar</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}