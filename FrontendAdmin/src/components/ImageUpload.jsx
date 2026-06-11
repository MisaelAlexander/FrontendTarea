// src/components/ui/ImageUpload.jsx
import React, { useRef, useEffect } from "react";

export const ImageUpload = ({ label, name, image, onChange, icon: Icon }) => {
  const fileInputRef = useRef(null);
  const previousImageRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previousImageRef.current) {
        URL.revokeObjectURL(previousImageRef.current);
      }
    };
  }, []);

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previousImageRef.current) {
        URL.revokeObjectURL(previousImageRef.current);
      }
      const imageUrl = URL.createObjectURL(file);
      previousImageRef.current = imageUrl;
      onChange(name, imageUrl, file);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <span className="text-[11px] font-bold text-gray-700 text-center leading-tight h-[30px] flex items-center justify-center">
        {label}
      </span>
      <div
        onClick={handleFileClick}
        className="w-full aspect-square bg-gray-50/80 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-[#3f8ec0] transition-all relative overflow-hidden group shadow-sm"
      >
        {image ? (
          <>
            <img src={image} className="w-full h-full object-cover" alt={label} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-[10px] font-bold">Cambiar Foto</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-gray-400 group-hover:text-[#3f8ec0] transition-colors">
            <Icon className="w-8 h-8 mb-2" strokeWidth={1.5} />
            <span className="text-[10px] text-center font-medium">Subir foto</span>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};