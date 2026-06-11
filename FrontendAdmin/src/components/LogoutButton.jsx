import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar cookies (asumiendo nombre 'token')
    document.cookie = 'Authtoken=; Max-Age=0; path=/;';
    // Si tienes otras cookies, límpialas igual
    // Opcional: llamar a un endpoint de logout
    // await axios.post('/api/logout');

    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
    >
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;