import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Hook personalizado para obtener y gestionar banners desde la API.
 * Maneja el estado de carga, errores y la lista de banners.
 * @returns {{ banners: Array, loading: boolean, error: string|null }}
 */
export function useBanners() {
  // Estado para almacenar la lista de banners
  const [banners, setBanners] = useState([]);
  // Estado para controlar la carga inicial
  const [loading, setLoading] = useState(true);
  // Estado para almacenar errores de la petición
  const [error, setError] = useState(null);

  // Efecto que se ejecuta una vez al montar el componente
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Llamada a la API para obtener todos los banners
        const data = await api.getBanners();
        setBanners(data);
      } catch (err) {
        // Captura y almacena cualquier error de la petición
        console.error('Error loading banners:', err);
        setError(err.message);
      } finally {
        // Finaliza el estado de carga independientemente del resultado
        setLoading(false);
      }
    };

    fetchBanners();
  }, []); // Array de dependencias vacío = se ejecuta solo una vez

  return { banners, loading, error };
}
