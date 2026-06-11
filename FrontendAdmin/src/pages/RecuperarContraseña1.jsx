import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PinInput from "../components/PinInput.jsx";
import Button from "../components/Button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";

export default function App() {
  const navigate = useNavigate();
  const [pinCompleto, setPinCompleto] = useState(""); // string vacío al inicio
  const [mensaje, setMensaje] = useState("");

  const handlePinComplete = (codigo) => {
    setPinCompleto(codigo);
    console.log("PIN ingresado:", codigo);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ¡IMPORTANTE! Evita recargar la página

    if (pinCompleto.length === 5) {
      setMensaje("Verificando código...");
      setTimeout(() => {
        setMensaje(`Código ${pinCompleto} validado correctamente.`);
        // Redirige después de la validación (puedo ajustar el tiempo)
        navigate("/nueva-contraseña"); 
      }, 2000);
    } else {
      setMensaje("Por favor, ingresa los 5 dígitos del PIN.");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      <CircleAnimation numCircles={20} />
      <motion.div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Ingrese Pin
            </h1>
            <p className="text-gray-500 mt-1">Este fue enviado a su correo</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-[#d2e3fc]/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-6 border border-white/40 shadow-inner">
              <p className="text-center text-gray-600 font-medium mb-2">Digite el PIN:</p>
              <PinInput length={5} onComplete={handlePinComplete} />
            </div>
            {mensaje && (
              <div className="text-center mb-4 text-sm font-medium text-gray-700">
                {mensaje}
              </div>
            )}
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
              <Button type="submit">Avanzar</Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}