import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';

const Layout = () => {
  const { user } = useAuth();
  const { loadCart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && user?.id) {
      loadCart(user.id);
    }
  }, [user, loadCart, ready]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
