import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import { newPassword } from "../hooks/recuperarContraseniaApi.js";

export default function PaginaNuevaContrasena() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const data = await newPassword(formData.password, formData.confirmPassword);
      alert(data.message);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Error al cambiar la contraseña.";
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
              Cambiar Contraseña
            </h1>
            <p className="text-gray-500 mt-1">
              Ingresa y confirma tu nueva contraseña
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              label="Nueva Contraseña"
              name="password"
              placeholder="Ingrese su nueva contraseña"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              placeholder="Confirme su nueva contraseña"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
            <div className="flex justify-center mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Aceptar"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}