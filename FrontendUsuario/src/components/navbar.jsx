import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ searchQuery, onSearchChange }) => {
  const { totalItems, openCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 sticky top-0 z-40">
      {/* Contenido igual que antes, pero usando handleInputChange y searchQuery */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold tracking-tight text-gray-800 shrink-0">
          Téchnē <span className="font-normal">Meraki</span>
        </Link>

        {/* Barra de búsqueda desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchQuery}
            onChange={handleInputChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#2596be] focus:border-[#2596be] sm:text-sm transition-colors"
          />
        </div>

        {/* Botón carrito y hamburguesa */}
        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            className="relative flex items-center bg-[#2596be] hover:bg-[#1e7a9b] text-white px-4 py-2 rounded-full transition-colors text-xs font-semibold"
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
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Búsqueda móvil */}
      <div className="md:hidden mt-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={handleInputChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-full"
          />
        </div>
      </div>

      {/* Menú colapsable (móvil) - enlaces */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-3 pb-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded" onClick={closeMenu}>
            Productos
          </Link>
          <Link to="/favoritos" className="text-gray-700 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded" onClick={closeMenu}>
            Favoritos
          </Link>
          <Link to="/contacto" className="text-gray-700 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded" onClick={closeMenu}>
            Contáctenos
          </Link>
          <Link to="/pedidos" className="text-gray-700 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded" onClick={closeMenu}>
            Mis Pedidos
          </Link>
        </div>
      </div>

      {/* Enlaces de escritorio */}
      <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-gray-600 ml-auto mt-2">
        <Link to="/dashboard" className="hover:text-blue-600">Productos</Link>
        <Link to="/favoritos" className="hover:text-blue-600">Favoritos</Link>
        <Link to="/contacto" className="hover:text-blue-600">Contáctenos</Link>
        <Link to="/pedidos" className="hover:text-blue-600">Mis Pedidos</Link>
      </div>
    </nav>
  );
};

export default Navbar;