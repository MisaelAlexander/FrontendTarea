import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PinInput from "../components/PinInput.jsx";
import Button from "../components/Button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import { verifyCode } from "../hooks/recuperarContraseniaApi.js";

export default function PaginaPin() {
  const navigate = useNavigate();
  const [pinCompleto, setPinCompleto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinComplete = (codigo) => {
    setPinCompleto(codigo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    if (pinCompleto.length !== 6) {
      setError("Por favor, ingresa el código completo de 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const data = await verifyCode(pinCompleto);
      setMensaje(data.message);
      setTimeout(() => {
        navigate("/nueva-contraseña");
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Código inválido o expirado.";
      setError(msg);
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
              Ingrese Pin
            </h1>
            <p className="text-gray-500 mt-1">Este fue enviado a su correo</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-[#d2e3fc]/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-6 border border-white/40 shadow-inner">
              <p className="text-center text-gray-600 font-medium mb-2">
                Digite el código:
              </p>
              <PinInput length={6} onComplete={handlePinComplete} />
            </div>
            {mensaje && (
              <p className="text-green-600 text-sm text-center mb-2">{mensaje}</p>
            )}
            {error && (
              <p className="text-red-500 text-sm text-center mb-2">{error}</p>
            )}
            <div className="text-center mb-8">
              <p className="text-gray-500 mt-1">
                <a
                  href="/"
                  className="text-[#1a365d] hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33] font-medium"
                >
                  Volver al inicio
                </a>
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Verificando..." : "Avanzar"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}