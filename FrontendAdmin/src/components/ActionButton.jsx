import React from 'react';

const ActionButton = ({ icon: Icon, onClick, variant = "blue" }) => {
  const variants = {
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    darkBlue: "bg-[#2d3a8c] text-white hover:bg-[#1e275e]",
    lightBlue: "bg-[#5c8eff] text-white hover:bg-[#4a7de6]",
  };

  return (
    <button 
      onClick={onClick}
      className={`p-1.5 sm:p-2 rounded-md transition-colors ${variants[variant]}`}
    >
      <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
    </button>
  );
};

export default ActionButton;