import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import { requestCode } from "../hooks/recuperarContraseniaApi.js";

export default function PaginaCorreo() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCorreo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!correo.trim()) {
      setError("El campo de correo es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      const data = await requestCode(correo);   // ← envía 'correo'
      alert(data.message);
      navigate("/codigo-correo");
    } catch (err) {
      const mensaje = err.response?.data?.message || "Error al enviar el código. Intente de nuevo.";
      setError(mensaje);
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
              Ingrese Correo
            </h1>
            <p className="text-gray-500 mt-1">Este fue enviado a su correo</p>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="correo"
              type="email"
              placeholder="Ingrese su correo"
              value={correo}
              onChange={handleChange}
              required
            />
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            <div className="text-center mb-8 mt-4">
              <p className="text-gray-500">
                <a href="/login" className="text-[#1a365d] hover:underline ...">Volver al login</a>
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Avanzar"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}