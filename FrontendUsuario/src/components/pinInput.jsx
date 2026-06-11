// Importamos React y los hooks necesarios
import React, { useState, useRef } from "react";

/**
 * Componente PinInput - Permite ingresar un código PIN dígito por dígito.
 * @param {number} length - Cantidad de dígitos del PIN (por defecto 5)
 * @param {function} onComplete - Callback que se ejecuta cuando el PIN está completo, recibe el código como string
 */
const PinInput = ({ length = 5, onComplete }) => {
  // Estado: array de strings, cada posición representa un dígito. Inicialmente todos vacíos.
  const [pin, setPin] = useState(Array(length).fill(""));
  
  // useRef: almacena referencias a los inputs para poder enfocarlos manualmente
  const inputRefs = useRef([]);

  /**
   * Maneja el cambio en cada input (cuando el usuario escribe un dígito)
   * @param {object} e - Evento del input
   * @param {number} index - Índice del input actual (0 a length-1)
   */
  const handleChange = (e, index) => {
    const value = e.target.value;
    // Validación: solo se permiten números (expresión regular)
    if (!/^[0-9]*$/.test(value)) return;

    // Copiamos el estado actual del PIN
    const newPin = [...pin];
    // Tomamos solo el último carácter ingresado (por si pegan varios números)
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);

    // Si se ingresó un dígito y no es el último input, movemos el foco al siguiente
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Verificamos si todos los dígitos están completos
    if (newPin.every((digit) => digit !== "")) {
      // Llamamos al callback con el PIN completo (un string concatenado)
      onComplete(newPin.join(""));
    }
  };

  /**
   * Maneja la tecla Backspace para borrar y retroceder automáticamente
   * @param {object} e - Evento de teclado
   * @param {number} index - Índice del input actual
   */
  const handleKeyDown = (e, index) => {
    // Si presiona Backspace, el input actual está vacío y no es el primero
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      // Enfocamos el input anterior
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    // Contenedor flexible que centra los inputs y se adapta a distintas pantallas
    <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
      {pin.map((digit, index) => (
        <input
          key={index}
          // Referencia para acceder a este input desde el array de refs
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"     // En móviles muestra teclado numérico
          maxLength={1}           // Solo un dígito por input
          value={digit}           // Valor controlado por React
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          // Clases responsivas con Tailwind:
          // - Tamaño base para móvil: w-10 h-12, texto xl
          // - sm: (640px+) w-12 h-14, texto 2xl
          // - md: (768px+) w-14 h-16, texto 3xl
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
          "
        />
      ))}
    </div>
  );
};

export default PinInput;