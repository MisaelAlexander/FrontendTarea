import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PinInput from "../components/pinInput.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import api from "../services/api";

export default function App() {
  const navigate = useNavigate();
  const [pinCompleto, setPinCompleto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinComplete = (codigo) => {
    setPinCompleto(codigo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (pinCompleto.length !== 6) {
      setError("Por favor, ingresa los 6 digitos del codigo.");
      return;
    }

    setLoading(true);
    try {
      await api.verifyRecoveryCode(pinCompleto);
      navigate("/nueva-contraseña");
    } catch (err) {
      setError(err.message || "Error al verificar codigo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      <CircleAnimation numCircles={20} />
      <motion.div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Verificar Codigo
            </h1>
            <p className="text-gray-500 mt-1">Ingrese el codigo enviado a su correo</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-[#d2e3fc]/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-6 border border-white/40 shadow-inner">
              <p className="text-center text-gray-600 font-medium mb-2">Digite el codigo:</p>
              <PinInput length={6} onComplete={handlePinComplete} />
            </div>
            {error && (
              <div className="text-center mb-4 text-sm font-medium text-red-500">
                {error}
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
              <Button type="submit" disabled={loading}>
                {loading ? "Verificando..." : "Verificar Codigo"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}