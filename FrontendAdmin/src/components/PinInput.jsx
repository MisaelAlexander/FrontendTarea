import React, { useState, useRef } from "react";

/**
 * Componente PinInput - Permite ingresar un código alfanumérico dígito por dígito.
 * @param {number} length - Cantidad de caracteres del código (por defecto 5)
 * @param {function} onComplete - Callback que se ejecuta cuando el código está completo, recibe el código como string (en minúsculas)
 */
const PinInput = ({ length = 5, onComplete }) => {
  const [pin, setPin] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  // Validación: solo letras (a-z, A-Z) y números (0-9)
  const isValidChar = (char) => /^[a-zA-Z0-9]$/.test(char);

  const handleChange = (e, index) => {
    let value = e.target.value;
    // Tomamos solo el último carácter ingresado (por si pegan varios)
    value = value.substring(value.length - 1);

    // Validar que sea alfanumérico
    if (!isValidChar(value) && value !== "") return;

    // Convertir a minúsculas para uniformidad con el backend
    value = value.toLowerCase();

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Mover al siguiente input si hay caracter y no es el último
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Verificar si todos los campos están llenos
    if (newPin.every((digit) => digit !== "")) {
      onComplete(newPin.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
      {pin.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="text"        // Ahora permite texto (no solo numérico)
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="
            w-7 h-9 
            sm:w-12 sm:h-14 
            md:w-14 md:h-16
            text-center 
            text-xl sm:text-2xl md:text-3xl 
            font-semibold 
            text-gray-800 
            bg-transparent 
            border-2 border-gray-400/50 
            rounded-xl 
            focus:outline-none 
            focus:ring-2 focus:ring-[#1a5a96] 
            focus:bg-white/50 
            transition-all 
            shadow-sm
            hover:border-[#1a5a96]/50
            uppercase
          "
        />
      ))}
    </div>
  );
};

export default PinInput;