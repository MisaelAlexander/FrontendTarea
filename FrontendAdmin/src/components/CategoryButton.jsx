// src/components/CategoryButton.jsx
import React from 'react';

const CategoryButton = ({ icon: Icon, label, onClick, isActive = false }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center rounded-2xl p-4 w-28 h-28 transition-all duration-300 ${
      isActive
        ? 'bg-[#2d3a8c] text-white shadow-lg scale-105 border-2 border-blue-400'
        : 'bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_4px_25px_rgb(0,0,0,0.1)] hover:-translate-y-1 text-gray-800'
    }`}
  >
    <Icon className={`h-8 w-8 mb-3 ${isActive ? 'text-white' : 'text-gray-800'}`} strokeWidth={1.5} />
    <span className={`text-xs font-bold text-center ${isActive ? 'text-white' : 'text-gray-800'}`}>{label}</span>
  </button>
);

export default CategoryButton;