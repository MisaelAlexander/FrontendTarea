import React from 'react';

const CategoryButton = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.05)] rounded-2xl p-4 w-28 h-28 hover:shadow-[0_4px_25px_rgb(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
    <Icon className="h-8 w-8 text-gray-800 mb-3" strokeWidth={1.5} />
    <span className="text-xs font-bold text-gray-800 text-center">{label}</span>
  </button>
);

export default CategoryButton;