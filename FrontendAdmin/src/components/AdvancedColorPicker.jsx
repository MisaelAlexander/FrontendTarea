// src/components/AdvancedColorPicker.jsx
import { useState } from 'react';
import { X, Pipette, Check } from 'lucide-react';

const AdvancedColorPicker = ({ onSelectColor, onClose }) => {
  const [tempColor, setTempColor] = useState("#3b82f6");
  const commonColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#8b8181', '#2d3a8c'
  ];

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 bg-white border border-gray-200 rounded-[2rem] shadow-2xl p-6 w-[320px]">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-sm flex items-center gap-2">
          <Pipette size={16} /> Selector de Color
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-black"><X size={18} /></button>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="color"
          value={tempColor}
          onChange={(e) => setTempColor(e.target.value)}
          className="w-16 h-16 rounded-xl border-none cursor-pointer bg-transparent"
        />
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Código Hex</p>
          <input
            type="text"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            className="w-full border rounded-lg p-1 text-sm font-mono uppercase"
          />
        </div>
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Sugeridos</p>
      <div className="grid grid-cols-5 gap-2 mb-6">
        {commonColors.map(c => (
          <button
            key={c}
            onClick={() => setTempColor(c)}
            className={`w-10 h-10 rounded-full border transition-transform hover:scale-110 ${tempColor === c ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <button
        onClick={() => onSelectColor(tempColor)}
        className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800"
      >
        <Check size={16} /> Añadir Color
      </button>
    </div>
  );
};

export default AdvancedColorPicker;