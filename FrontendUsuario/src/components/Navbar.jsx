import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, LogOut, Home, Heart, Tag, Phone, Package, LayoutGrid } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ searchQuery, onSearchChange }) => {
  const { totalItems, openCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleInputChange = (e) => {
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/');
  };

  const showSearch = ['/', '/dashboard', '/favoritos'].includes(location.pathname);

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-800 shrink-0">
          Téchnē <span className="font-normal">Meraki</span>
        </Link>

        {/* Barra de busqueda - solo en Inicio, Productos y Favoritos */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={searchQuery || ''}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#2596be] sm:text-sm"
            />
          </div>
        )}

        {/* Botones derecha */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={openCart}
                className="relative flex items-center bg-[#2596be] hover:bg-[#1e7a9b] text-white px-4 py-2 rounded-full text-xs font-semibold"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrito
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1 text-gray-600 hover:text-red-600 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1 bg-[#2596be] hover:bg-[#1e7a9b] text-white px-4 py-2 rounded-full text-xs font-semibold"
            >
              <User className="h-4 w-4" />
              Iniciar Sesion
            </Link>
          )}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Busqueda movil - solo en Inicio, Productos y Favoritos */}
      {showSearch && (
        <div className="md:hidden mt-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery || ''}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Menu movil */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-1 pb-4 border-t border-gray-100 pt-3">
          <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded hover:bg-gray-50" onClick={closeMenu}>
            <Home className="h-4 w-4" /> Inicio
          </Link>
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded hover:bg-gray-50" onClick={closeMenu}>
            <LayoutGrid className="h-4 w-4" /> Productos
          </Link>
          {user && (
            <>
              <Link to="/favoritos" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded hover:bg-gray-50" onClick={closeMenu}>
                <Heart className="h-4 w-4" /> Favoritos
              </Link>
              <Link to="/promociones" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded hover:bg-gray-50" onClick={closeMenu}>
                <Tag className="h-4 w-4" /> Promociones
              </Link>
              <Link to="/pedidos" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded hover:bg-gray-50" onClick={closeMenu}>
                <Package className="h-4 w-4" /> Mis Pedidos
              </Link>
            </>
          )}
          <Link to="/contacto" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded hover:bg-gray-50" onClick={closeMenu}>
            <Phone className="h-4 w-4" /> Contáctenos
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-left text-red-600 hover:text-red-700 text-sm font-medium px-3 py-2 rounded hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Cerrar Sesion
            </button>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded hover:bg-gray-50" onClick={closeMenu}>
              <User className="h-4 w-4" /> Iniciar Sesion
            </Link>
          )}
        </div>
      </div>

      {/* Enlaces escritorio */}
      <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-gray-600 ml-auto mt-2">
        <Link to="/" className="flex items-center gap-1 hover:text-blue-600 px-3 py-1.5 rounded hover:bg-gray-50">
          <Home className="h-4 w-4" /> Inicio
        </Link>
        <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-600 px-3 py-1.5 rounded hover:bg-gray-50">
          <LayoutGrid className="h-4 w-4" /> Productos
        </Link>
        {user && (
          <>
            <Link to="/favoritos" className="flex items-center gap-1 hover:text-blue-600 px-3 py-1.5 rounded hover:bg-gray-50">
              <Heart className="h-4 w-4" /> Favoritos
            </Link>
            <Link to="/promociones" className="flex items-center gap-1 hover:text-blue-600 px-3 py-1.5 rounded hover:bg-gray-50">
              <Tag className="h-4 w-4" /> Promociones
            </Link>
            <Link to="/pedidos" className="flex items-center gap-1 hover:text-blue-600 px-3 py-1.5 rounded hover:bg-gray-50">
              <Package className="h-4 w-4" /> Mis Pedidos
            </Link>
          </>
        )}
        <Link to="/contacto" className="flex items-center gap-1 hover:text-blue-600 px-3 py-1.5 rounded hover:bg-gray-50">
          <Phone className="h-4 w-4" /> Contáctenos
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
