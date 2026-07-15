import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import api from "../services/api";

export default function App() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(newPassword, confirmPassword);
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al cambiar contrasena");
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
              Cambiar Contrasena
            </h1>
            <p className="text-gray-500 mt-1">Establece una nueva contrasena segura</p>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              label="Nueva Contrasena"
              name="newPassword"
              placeholder="Ingrese su nueva contrasena"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirmar Contrasena"
              name="confirmPassword"
              placeholder="Confirme su nueva contrasena"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Guardando..." : "Guardar Contrasena"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}