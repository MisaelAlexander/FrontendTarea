import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← Cambia "react-router" a "react-router-dom"
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";

export default function App() {
  const navigate = useNavigate(); // ← Ejecuta el hook para obtener la función
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    alert(`Registro enviado con: ${formData.email}`);
    navigate("/codigo-correo"); // ← Ahora funciona
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      <CircleAnimation numCircles={20} />
      <motion.div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Ingrese Correo
            </h1>
            <p className="text-gray-500 mt-1">Este fue enviado a su correo</p>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Ingrese su correo"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="text-center mb-8">
              <p className="text-gray-500 mt-1">
                <a
                  href="/login"
                  className="text-[#1a365d] hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33] font-medium"
                >
                  Volver al login
                </a>
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit">Avanzar</Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}