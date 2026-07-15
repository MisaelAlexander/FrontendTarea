import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import api from "../services/api";

export default function App() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.requestRecoveryCode(correo);
      navigate("/codigo-correo");
    } catch (err) {
      setError(err.message || "Error al solicitar codigo");
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
              Recuperar Contrasena
            </h1>
            <p className="text-gray-500 mt-1">Ingrese su correo para recibir el codigo</p>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              label="Correo"
              name="correo"
              type="email"
              placeholder="Ingrese su correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
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
                {loading ? "Enviando..." : "Enviar Codigo"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}