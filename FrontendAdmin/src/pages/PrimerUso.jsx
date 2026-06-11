// src/components/forms/RegisterForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Lock, Eye, EyeOff, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { ImageUpload } from "../components/ImageUpload";
import { useForm } from "../hooks/useForms";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({
    nombres: "",
    apellidos: "",
    correo: "",
    password: "",
    confirmPassword: ""
  });

  const [images, setImages] = useState({
    duiFront: null,
    duiBack: null,
    profile: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Referencias para los timeouts y poder limpiarlos
  const messageTimeoutRef = useRef(null);
  const redirectTimeoutRef = useRef(null);

  // Limpiar timeouts cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  const handleImageChange = (name, imageUrl) => {
    setImages({ ...images, [name]: imageUrl });
  };

  const showMessage = (text, type) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setMessage({ text, type });
    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      showMessage("Las contraseñas no coinciden.", "error");
      return;
    }

    if (formData.password.length < 6) {
      showMessage("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    // Validar imágenes
    if (!images.duiFront || !images.duiBack || !images.profile) {
      showMessage("Por favor sube todas las fotos solicitadas (DUI y Perfil).", "error");
      return;
    }

    // Aquí iría la llamada a tu API para guardar el usuario
    console.log("Datos del nuevo usuario:", formData);
    console.log("Imágenes subidas:", images);

    // Mostrar mensaje de éxito
    showMessage(`¡Usuario ${formData.nombres} creado con éxito!`, "success");

    // Redirigir al login después de 2 segundos
    if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    redirectTimeoutRef.current = setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <Input
          label="Nombres"
          name="nombres"
          placeholder="Ej. Juan Carlos"
          icon={User}
          value={formData.nombres}
          onChange={handleChange}
          required
        />
        <Input
          label="Apellidos"
          name="apellidos"
          placeholder="Ej. Pérez"
          icon={User}
          value={formData.apellidos}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Correo Electrónico"
        name="correo"
        type="email"
        placeholder="correo@ejemplo.com"
        icon={Mail}
        value={formData.correo}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <Input
          label="Contraseña"
          name="password"
          placeholder="Crea una contraseña"
          type={showPassword ? "text" : "password"}
          icon={showPassword ? EyeOff : Eye}
          onIconClick={() => setShowPassword(!showPassword)}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Confirmar Contraseña"
          name="confirmPassword"
          placeholder="Repite la contraseña"
          type={showConfirmPassword ? "text" : "password"}
          icon={showConfirmPassword ? EyeOff : Eye}
          onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mt-6 mb-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
          <ImageUpload
            label="Agrega foto frontal de tu DUI"
            name="duiFront"
            image={images.duiFront}
            onChange={handleImageChange}
            icon={Camera}
            required
          />
          <ImageUpload
            label="Agrega foto del reverso de tu DUI"
            name="duiBack"
            image={images.duiBack}
            onChange={handleImageChange}
            icon={Camera}
            required
          />
          <ImageUpload
            label="Agrega foto de perfil"
            name="profile"
            image={images.profile}
            onChange={handleImageChange}
            icon={User}
            required
          />
        </div>
      </div>

      {message.text && (
        <div className={`mt-2 mb-4 p-3 text-sm font-bold rounded-lg text-center ${
          message.type === "error"
            ? "bg-red-50 text-red-600 border border-red-200"
            : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {message.text}
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full">
        Registrar Usuario
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="font-bold text-[#165892] hover:underline transition-colors">
           Esto solo esta por el momento
          </a>
        </p>
      </div>
    </form>
  );
}