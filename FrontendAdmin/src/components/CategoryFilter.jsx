// src/components/CategoryFilter.jsx
import React from 'react';
import { Smartphone, Laptop, Headphones, CircuitBoard, Package, Tags } from 'lucide-react';
import CategoryButton from './CategoryButton';

// Mapeo de iconos por categoría
const categoryIcons = {
  'Telefonos': Smartphone,
  'Laptops': Laptop,
  'Auriculares': Headphones,
  'Componentes': CircuitBoard,
  'General': Package,
  'Todos': Tags
};

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  // Si no hay categorías personalizadas, usar el mapeo por defecto
  const displayCategories = ['Todos', ...categories];
  
  return (
    <div className="w-full mb-10 overflow-x-auto pb-4">
      <div className="flex gap-4 justify-start min-w-max">
        {displayCategories.map((cat) => {
          const IconComponent = categoryIcons[cat] || Package;
          return (
            <CategoryButton
              key={cat}
              icon={IconComponent}
              label={cat}
              onClick={() => onSelectCategory(cat)}
              isActive={selectedCategory === cat}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;