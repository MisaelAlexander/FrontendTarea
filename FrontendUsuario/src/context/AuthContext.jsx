import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.checkSession()
      .then((cliente) => {
        if (cliente) setUser({ id: cliente._id, nombre: cliente.nombre, usuario: cliente.usuario });
      })
      .catch(() => {
        // No session active, user stays null
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (usuario, password) => {
    const data = await api.login(usuario, password);
    setUser({ id: data.clienteId, nombre: data.nombre, usuario: data.usuario });
    return data;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
