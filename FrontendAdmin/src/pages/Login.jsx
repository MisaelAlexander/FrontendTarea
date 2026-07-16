// Login.jsx (o App.jsx, según tu estructura)
import React, { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar error al escribir
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ajusta la URL base según tu entorno
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || "http://localhost:4000";
      const response = await fetch(`${API_BASE_URL}/api/login-admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          contraseña: formData.password, // mapeo de "password" a "contraseña"
        }),
        credentials: "include", // necesario para que el navegador reciba y envíe la cookie
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Login exitoso: la cookie 'adminToken' ya está guardada automáticamente
      console.log("Login exitoso:", data);
      // Opcional: guardar información del admin en contexto o localStorage
      // localStorage.setItem("adminNombre", data.nombre);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message);
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
              Iniciar Sesión
            </h1>
            <p className="text-gray-500 mt-1">Ingresa tus credenciales para acceder</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Usuario"
              name="usuario"
              placeholder="Ingrese su usuario"
              icon={User}
              value={formData.usuario}
              onChange={handleChange}
              disabled={loading}
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
              disabled={loading}
            />

            <div className="text-center mb-8">
              <p className="font text-[#1a365d] mt-1">
                <a
                  href="/recuperar-contraseña"
                  className="hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33]"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}