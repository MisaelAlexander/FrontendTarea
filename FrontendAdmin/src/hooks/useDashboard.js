import { useState } from 'react';

/**
 * Hook para la página Dashboard del admin.
 * Maneja: vista actual del dashboard.
 */
export function useDashboard() {
  // Estado: vista actual ('dashboard' u otra)
  const [currentView, setCurrentView] = useState('dashboard');

  return {
    currentView,            // Vista actual del dashboard
    setCurrentView,         // Función para cambiar vista
  };
}
