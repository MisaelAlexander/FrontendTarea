import React from 'react';

export default function Input({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  onIconClick,
  value,
  onChange,
  name,
  className = "",
  ...rest
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#165892] focus:border-transparent ${className}`}
          {...rest}
        />
        {Icon && (
          <button
            type="button"
            onClick={onIconClick}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={type === "password" ? "Mostrar contraseña" : "Ocultar contraseña"}
          >
            <Icon size={20} />
          </button>
        )}
      </div>
    </div>
  );
}